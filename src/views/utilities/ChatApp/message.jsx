import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from 'context/ChatContext';
import { AuthContext } from 'context/AuthContext';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Container, Stack, Typography, Box, Chip, Avatar, Modal, IconButton } from '@mui/material';
import { firestore } from '../../../firebase';
import CloseIcon from '@mui/icons-material/Close';

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const [dataForm, setDataForm] = useState([]);
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Set images array when fullScreenImage changes
        if (fullScreenImageIndex !== null) {
            const imgs = message.img.map((image, index) => ({ src: image, index }));
            setImages(imgs);
            setCurrentIndex(imgs.findIndex((img) => img.index === fullScreenImageIndex));
        }
    }, [fullScreenImageIndex]);

    const handleImageClick = (image, index) => {
        setFullScreenImageIndex(index);
    };

    const handleCloseFullScreenImage = () => {
        setFullScreenImageIndex(null);
    };
    const handleKeyDown = (e) => {
        if (images.length === 0) return;

        switch (e.key) {
            case 'ArrowLeft':
                setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
                break;
            case 'ArrowRight':
                setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
                break;
            default:
                break;
        }
    };

    const ref = useRef();
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const dataProduct = doc.data();
                setDataForm({
                    ...dataProduct,
                    avatar: dataProduct.avatar
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };
    useEffect(() => {
        if (currentUser.email) {
            findUser();
        }
    }, [currentUser.email]);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <Container className={`message ${message.senderId === currentUser.uid && 'owner'}`} ref={ref}>
            <Stack className="messageInfo" direction="row" alignItems="center" spacing={1}>
                <Avatar src={message.senderId === currentUser.uid ? dataForm?.avatar : data.user.photoURL} alt={message.senderId} />
                <Typography>{message.timeStamp ? new Date(message.timeStamp.toDate()).toLocaleTimeString() : 'just now'}</Typography>
            </Stack>
            <Stack className="messageContent" direction="row" sx={{ width: '300px' }}>
                {message.text && (
                    <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                        {message.text}
                    </Typography>
                )}
                <Box>
                    {message.img &&
                        message.img.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt=""
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    objectFit: 'cover',
                                    margin: '4px 0'
                                }}
                                onClick={() => handleImageClick(image, index)} // Add onClick event
                            />
                        ))}{' '}
                    {message.img && (
                        <Chip
                            label="Image"
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{ position: 'absolute', bottom: 10, right: 10 }}
                        />
                    )}
                </Box>
            </Stack>
            <Modal open={fullScreenImageIndex !== null} onClose={handleCloseFullScreenImage} onKeyDown={handleKeyDown}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <IconButton style={{ position: 'absolute', top: 10, right: 10, color: '#fff' }} onClick={handleCloseFullScreenImage}>
                        <CloseIcon />
                    </IconButton>
                    {images.length > 0 && (
                        <img src={images[currentIndex].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                </div>
            </Modal>
        </Container>
    );
};

export default Message;
