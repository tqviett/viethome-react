import React, { useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { AuthContext } from 'context/AuthContext';
import { firestore } from '../../../firebase';
import { Container, Typography, Stack, TextField } from '@mui/material';
import Avatar from 'ui-component/extended/Avatar';

const Search = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [dataForm, setDataForm] = useState([]);
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

    const handleSearch = async () => {
        const q = query(collection(firestore, 'users'), where('name', '==', username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === 'Enter' && handleSearch();
    };

    const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId = currentUser.uid > user.id ? currentUser.uid + user.id : user.id + currentUser.uid;
        try {
            const res = await getDoc(doc(firestore, 'chats', combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(firestore, 'chats', combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
                    [combinedId + '.userInfo']: {
                        id: dataForm.id,
                        displayName: dataForm.name,
                        photoURL: dataForm.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });

                await updateDoc(doc(firestore, 'userChats', user.id), {
                    [combinedId + '.userInfo']: {
                        id: dataForm.id,
                        displayName: dataForm.name,
                        photoURL: dataForm.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });
            }
        } catch (err) {}

        setUser(null);
        setUsername('');
    };

    return (
        <Stack className="search">
            <Stack className="searchForm">
                <input
                    type="text"
                    placeholder="Find a user"
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </Stack>
            {err && <Stack>User not found!</Stack>}
            {user && (
                <Typography className="userChat" onClick={handleSelect}>
                    <Avatar src={user.avatar} alt="" />
                    <Stack className="userChatInfo">
                        <Stack>{user.name}</Stack>
                    </Stack>
                </Typography>
            )}
        </Stack>
    );
};

export default Search;
