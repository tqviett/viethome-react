import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from 'context/ChatContext';
import { firestore } from '../../../firebase';
import Message from './message';
import { Stack } from '@mui/material';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(firestore, 'chats', data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    return (
        <Stack className="messages">
            {messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </Stack>
    );
};

export default Messages;
