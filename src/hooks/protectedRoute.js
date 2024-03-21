import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const { pathname } = useLocation();
    const publicRoute = ['/', '/home', '/login', '/register'];

    if (!(publicRoute.includes(pathname) || user)) {
        return <Navigate to="/login" />;
    }

    const role = userInfo?.role;
    const adminRoutes = ['/admin'];
    const userRoutes = ['/user'];

    if (role === 'user' && adminRoutes.includes(pathname)) {
        return <Navigate to="/home" />;
    }

    if (role === 'admin' && userRoutes.includes(pathname)) {
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};
ProtectedRoute;
