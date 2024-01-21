import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const { pathname } = useLocation();
    const publicRoute = ['/login', '/register'];

    if (publicRoute.includes(pathname) && !!user) {
        return <Navigate to="/dashboard" />;
    }
    if (!(publicRoute.includes(pathname) || user)) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
};
