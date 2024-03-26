import React from 'react';
import Search from './search';
import Chats from './chats';
import Navbar from './navbar';
import { Container, Stack, Typography, Button } from '@mui/material';

const Sidebar = () => {
    return (
        <Stack className="sidebar">
            <Navbar />
            <Search />
            <Chats />
        </Stack>
    );
};

export default Sidebar;
