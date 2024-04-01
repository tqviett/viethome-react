import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'context/AuthContext';
import { Stack, Typography, Toolbar, Avatar, AppBar, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const Navbar = () => {
    const { currentUser } = useContext(AuthContext);
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }} className="navbar">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={currentUser.name} src={currentUser.avatar} />
                    <Box>
                        <Typography variant="body1" component="span">
                            {currentUser.name}
                        </Typography>
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
