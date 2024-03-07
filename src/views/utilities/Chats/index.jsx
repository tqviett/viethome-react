import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// components
import { ChatCardWidget, ChatList } from 'ui-component/chats';
// mock
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function ChatsPage() {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    const findAll = async () => {
        const doc_refs = await getDocs(collection(firestore, FIRESTORE.USERS));
        const res = [];
        doc_refs.forEach((user) => {
            res.push({
                ...user.data(),
                id: user.id
            });
        });
        setChats(res);
        return res;
    };

    useEffect(() => {
        findAll();
    }, []);

    return (
        <>
            <Helmet>
                <title> Dashboard: Chats | viet-home </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Message
                </Typography>
                <ChatList users={chats} />
                <ChatCardWidget />
            </Container>
        </>
    );
}
