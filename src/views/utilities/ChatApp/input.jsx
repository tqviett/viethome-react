import React, { useContext, useState } from 'react';
import { AuthContext } from 'context/AuthContext';
import { ChatContext } from 'context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage } from '../../../firebase';
import Img from '../../../assets/images/chat/img.png';
import { Button, IconButton, Box, TextField } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const Input = () => {
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    //TODO:Handle Error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(firestore, 'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(firestore, 'chats', data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            });
        }

        await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
            [data.chatId + '.lastMessage']: {
                text
            },
            [data.chatId + '.date']: serverTimestamp()
        });

        await updateDoc(doc(firestore, 'userChats', data.user.id), {
            [data.chatId + '.lastMessage']: {
                text
            },
            [data.chatId + '.date']: serverTimestamp()
        });

        setText('');
        setImg(null);
    };
    return (
        <Box className="input">
            <TextField fullWidth type="text" placeholder="Type something..." onChange={(e) => setText(e.target.value)} value={text} />
            <Box className="send">
                <input type="file" style={{ display: 'none' }} id="file" onChange={(e) => setImg(e.target.files[0])} />
                <IconButton htmlFor="file" component="label">
                    <AddPhotoAlternateIcon />
                </IconButton>
                <Button onClick={handleSend}>Send</Button>
            </Box>
        </Box>
    );
};

export default Input;
