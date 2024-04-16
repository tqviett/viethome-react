import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const { pathname } = useLocation();
    const publicRoute = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
        '/about-me',
        '/privacy-policy',
        '/resolve-complaints',
        '/terms-of-use'
    ];

    if (!(publicRoute.includes(pathname) || user)) {
        return <Navigate to="/login" />;
    }

    const role = userInfo?.role;
    const adminRoutes = ['/admin', '/admin/dashboard', '/admin/ManageProducts', '/admin/ManageUsers'];
    const userRoutes = ['/user', '/user/my-products', '/user/product/create', '/user/favorites'];

    if (role === 'user' && adminRoutes.includes(pathname)) {
        return <Navigate to="/" />;
    }

    if (role === 'admin' && userRoutes.includes(pathname)) {
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};
ProtectedRoute;
