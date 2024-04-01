import { onSnapshot, collection, query, where, getDoc, getDocs, doc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'context/AuthContext';
import { ChatContext } from 'context/ChatContext';
import { firestore } from '../../../firebase';
import { Container, Stack, Typography, Avatar, Button } from '@mui/material';

const Chats = () => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(firestore, 'userChats', currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);
    const handleSelect = (u) => {
        dispatch({ type: 'CHANGE_USER', payload: u });
    };

    return (
        <Stack className="chats">
            {Object.entries(chats)
                ?.sort((a, b) => b[1].date - a[1].date)
                .map((chat) => (
                    <Button className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                        <Avatar src={chat[1].userInfo.avatar} alt="" />
                        <Stack className="userChatInfo">
                            <span>{chat[1].userInfo.name}</span>
                            <Typography sx={{ color: 'silver' }} noWrap>
                                {chat[1].lastMessage?.text}
                            </Typography>
                        </Stack>
                    </Button>
                ))}
        </Stack>
    );
};

export default Chats;
