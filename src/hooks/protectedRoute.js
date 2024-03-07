import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const { pathname } = useLocation();
    const publicRoute = ['/login', '/register'];
    // admin route [duyệt, users]
    // user route [đổi mật khẩu, bài đăng của tôi, bài đăng đã lưu, chat]

    // Keyword: Redux
    // Tìm hiểu redux để lấy/lưu data vào store
    // có 1 hàm lấy data user đang đăng nhập, rồi lưu vào app
    // Lấy từ store ra -> Load lại page là mất, nên cần có 1 hàm lấy lại ở đây
    // Vào folder /store/custom...
    //     const user = useSelector((state) => state.customization.user);
    // check../

    // Hoặc lấy data user ra localStorage

    // Check role
    // Chia route cho admin và user
    // Check nếu route của admin, role của user thì không cho vào, quay lại route post
    // Ngược lại //

    if (publicRoute.includes(pathname) && !!user) {
        return <Navigate to="/dashboard" />;
    }
    if (!(publicRoute.includes(pathname) || user)) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
};
