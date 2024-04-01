import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            findUser(user);
        });

        return () => {
            unsub();
        };
    }, []);
    const findUser = async (user) => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setCurrentUser({
                    ...data,
                    uid: data.id
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
