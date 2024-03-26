import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from 'context/ChatContext';
import { AuthContext } from 'context/AuthContext';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Container, Stack, Typography, Divider, Chip, Avatar } from '@mui/material';
import { firestore } from '../../../firebase';

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const [dataForm, setDataForm] = useState([]);

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
                {message.text && <Typography variant="body1">{message.text}</Typography>}
                {message.img && <img src={message.img} alt="" style={{ width: '100%', borderRadius: 4 }} />}
                {message.img && (
                    <Chip
                        label="Image"
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ position: 'absolute', bottom: 10, right: 10 }}
                    />
                )}
            </Stack>
        </Container>
    );
};

export default Message;
