import React, { useContext } from 'react';
import { ChatContext } from 'context/ChatContext';
import Input from './input';
import Messages from './messages';
import { AppBar, Stack, Typography, Toolbar, Chip } from '@mui/material';

const Chat = () => {
    const { data } = useContext(ChatContext);
    return (
        <Stack className="chat">
            <Toolbar className="chatInfo" sx={{ height: '100px' }}>
                <Typography sx={{ fontSize: '20px', marginLeft: '20px' }}>{data.user?.displayName}</Typography>
            </Toolbar>
            <Messages />
            <Input />
        </Stack>
    );
};

export default Chat;
