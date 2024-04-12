import React, { useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { Container, Typography, Stack, TextField, Button, Divider } from '@mui/material';
import Avatar from 'ui-component/extended/Avatar';
import { ChatContext } from 'context/ChatContext';
import { AuthContext } from 'context/AuthContext';

const Search = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [u, setU] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSearch = async () => {
        const q = query(collection(firestore, 'users'), where('name', '==', username));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                if (docData.role === 'admin') {
                    setErr(true);
                    setU(false);
                } else {
                    setUser(docData);
                    setU(true);
                }
            } else {
                setErr(true);
                setU(false);
            }
        } catch (error) {
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

            if (res.exists()) {
                // Nếu combinedId đã tồn tại, thực hiện các hành động cần thiết
                dispatch({ type: 'CHANGE_CHAT_USER', load: user, payload: combinedId });
            } else {
                //tạo chat trong chats collection
                await setDoc(doc(firestore, 'chats', combinedId), { messages: [] });

                //tạo user chats
                await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
                    [combinedId + '.userInfo']: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });

                await updateDoc(doc(firestore, 'userChats', user.id), {
                    [combinedId + '.userInfo']: {
                        id: currentUser.id,
                        name: currentUser.name,
                        avatar: currentUser.avatar
                    },
                    [combinedId + '.date']: serverTimestamp()
                });
                dispatch({ type: 'CHANGE_CHAT_USER', load: user, payload: combinedId });
            }
        } catch (err) {
            console.error('Error checking combinedId:', err);
        }

        setUser(null);
        setUsername('');
    };
    return (
        <>
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
                {u ? (
                    <>
                        {user && (
                            <Button className="userChat" onClick={handleSelect}>
                                <Avatar src={user.avatar} alt="" />
                                <Stack className="userChatInfo">
                                    <Typography>{user.name}</Typography>
                                </Stack>
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {err && (
                            <Stack className="userChat">
                                <Typography sx={{ color: 'white', textAlign: 'center' }}>Không tìm thấy người dùng</Typography>
                            </Stack>
                        )}
                    </>
                )}
            </Stack>
            <Divider />
        </>
    );
};

export default Search;
