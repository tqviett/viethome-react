import { useLocalStorage } from 'hooks/useLocalStorage';

export const useAuth = () => {
    const [user, setUser] = useLocalStorage('user', window.localStorage.getItem('user'));
    return { user };
};
