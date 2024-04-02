import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from 'context/AuthContext';
import { ChatContext } from 'context/ChatContext';
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
    setDoc,
    getDoc,
    query,
    collection,
    where,
    getDocs
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage } from '../../../firebase';
import Img from '../../../assets/images/chat/img.png';
import { Button, IconButton, Box, Stack, ImageList, ImageListItem, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled, useTheme } from '@mui/material/styles';
import { useParams, useLocation } from 'react-router-dom';
import { FIRESTORE } from '../../../constants';

const Input = () => {
    const [text, setText] = useState('');
    const [img, setImg] = useState([]);
    const params = useParams();
    const { currentUser } = useContext(AuthContext);
    const { data, dispatch } = useContext(ChatContext);
    const [paramCheck, setParamCheck] = useState(false);
    const [user, setUser] = useState([]);

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

                    // Sau khi gửi tin nhắn thành công, cập nhật state của text thành chuỗi rỗng
                    setText('');
                    setImg([]);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };
    const [productData, setProductData] = useState([]);
    const fetchProductData = async () => {
        try {
            const snap = await getDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id));
            if (snap.exists()) {
                setProductData(snap.data());
            } else {
                console.log('No such document');
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', productData.emailUser));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setUser({
                    ...data,
                    id: data.id,
                    avatar: data.avatar
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };
    const location = useLocation();
    useEffect(() => {
        if (params.id && !paramCheck) {
            fetchProductData();
            const previousUrl = location.state?.from || '';
            console.log('url:', previousUrl);
            setText(previousUrl);
            setParamCheck(true);
        }
    }, [params, paramCheck, location.state]);
    useEffect(() => {
        if (productData.emailUser) {
            findUser();
        }
    }, [productData.emailUser]);
    useEffect(() => {
        if (user.id && currentUser.uid) {
            handleSelect();
        }
    }, [user.id, currentUser.id]);
    //
    const handleSelect = async () => {
        const combinedId = currentUser.uid > user.id ? currentUser.uid + user.id : user.id + currentUser.uid;
        try {
            const res = await getDoc(doc(firestore, 'chats', combinedId));

            if (res.exists()) {
                // Nếu combinedId đã tồn tại, thực hiện các hành động cần thiết
                dispatch({ type: 'CHANGE_CHAT_USER', load: user, payload: combinedId });
            } else {
                //create a chat in chats collection
                await setDoc(doc(firestore, 'chats', combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
                    [combinedId + '.userInfo']: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });

                await updateDoc(doc(firestore, 'userChats', user.id), {
                    [combinedId + '.userInfo']: {
                        id: currentUser.id,
                        name: currentUser.name,
                        avatar: currentUser.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });
                dispatch({ type: 'CHANGE_CHAT_USER', load: user, payload: combinedId });
            }
        } catch (err) {
            console.error('Error checking combinedId:', err);
        }

        setUser([]);
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
                        multiline
                        maxRows={4}
                        type="text"
                        placeholder="Type something..."
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        onKeyDown={handleKeyDown}
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
