import React, { useContext, useState } from 'react';
import { AuthContext } from 'context/AuthContext';
import { ChatContext } from 'context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage } from '../../../firebase';
import Img from '../../../assets/images/chat/img.png';
import { Button, IconButton, Box, Stack, ImageList, ImageListItem, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled, useTheme } from '@mui/material/styles';

const StyledProductImg = styled('img')({
    top: 0,
    width: 80,
    height: 80,
    objectFit: 'cover',
    position: 'absolute'
});
const Input = () => {
    const [text, setText] = useState('');
    const [img, setImg] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleChangeImages = (e) => {
        const newImages = Array.from(e.target.files);
        setImg(newImages);
    };
    const handleRemoveImage = (index) => {
        const updatedImages = [...img];
        updatedImages.splice(index, 1);
        setImg(updatedImages);
    };

    const uploadMultipleImages = async (images) => {
        const promises = [];
        for (const image of images) {
            const storageRef = ref(storage, `chat/${currentUser.uid}-${uuid()}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            promises.push(
                new Promise((resolve, reject) => {
                    uploadTask.on(
                        (error) => {
                            reject(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                resolve(downloadURL);
                            });
                        }
                    );
                })
            );
        }

        return Promise.all(promises);
    };

    const handleSend = async () => {
        if (data.chatId) {
            if (text || img) {
                try {
                    const downloadURLs = await uploadMultipleImages(img);
                    await updateDoc(doc(firestore, 'chats', data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURLs
                        })
                    });
                    await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
                        [data.chatId + '.lastMessage']: {
                            text,
                            img: downloadURLs || null
                        },
                        [data.chatId + '.date']: serverTimestamp()
                    });

                    await updateDoc(doc(firestore, 'userChats', data.user.id), {
                        [data.chatId + '.lastMessage']: {
                            text,
                            img: downloadURLs || null
                        },
                        [data.chatId + '.date']: serverTimestamp()
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
        <Box className="input" sx={{ display: 'flex' }}>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                    width: '100%',
                    height: 'auto'
                }}
            >
                {img.length > 0 && (
                    <Box
                        sx={{
                            width: 'auto',
                            overflowX: 'auto',
                            maxWidth: '700px'
                        }}
                    >
                        <ImageList cols={100} rowHeight={100} sx={{ overflowY: 'auto' }}>
                            {img.map((image, index) => (
                                <Box key={index} sx={{ position: 'relative', width: '100px', height: '100px', margin: '0' }}>
                                    <ImageListItem sx={{ width: '100%', height: '100%' }}>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`product-img-${index}`}
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    </ImageListItem>
                                    <IconButton sx={{ position: 'absolute', top: 0, right: 1 }} onClick={() => handleRemoveImage(index)}>
                                        <HighlightOffIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </ImageList>
                    </Box>
                )}
                <Box sx={{ width: '100%', display: ' flex' }}>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="Type something..."
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                    <Box className="send" sx={{ display: 'flex', alignItems: 'center' }}>
                        <input multiple accept="image/*" type="file" style={{ display: 'none' }} id="file" onChange={handleChangeImages} />
                        <label htmlFor="file">
                            <IconButton component="span">
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </label>
                        <Button onClick={handleSend}>Send</Button>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default Input;
