import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'context/AuthContext';
import { Stack, Typography, Toolbar, Avatar, AppBar, Box } from '@mui/material';
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useTheme } from '@mui/material/styles';
const Navbar = () => {
    const [dataForm, setDataForm] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const theme = useTheme();
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

    return (
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }} className="navbar">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={dataForm.name} src={dataForm.avatar} />
                    <Box>
                        <Typography variant="body1" component="span">
                            {dataForm.name}
                        </Typography>
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
