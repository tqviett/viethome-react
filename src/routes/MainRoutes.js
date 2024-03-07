import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const Products = Loadable(lazy(() => import('views/utilities/Products')));
const CreateProducts = Loadable(lazy(() => import('views/utilities/Products/createProduct')));
const EditProducts = Loadable(lazy(() => import('views/utilities/Products/editProduct')));
const ViewProducts = Loadable(lazy(() => import('views/utilities/Products/viewProduct')));
const Money = Loadable(lazy(() => import('views/utilities/Money')));
const EditMoney = Loadable(lazy(() => import('views/utilities/Money/editMoney')));
//utilities routing chat and user
const Chats = Loadable(lazy(() => import('views/utilities/Chats/chat')));
const ChatBox = Loadable(lazy(() => import('views/utilities/ChatBox/chatBox')));
const Users = Loadable(lazy(() => import('views/utilities/Users')));
// sample page routing
const Orders = Loadable(lazy(() => import('views/utilities/Orders')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/products',
            element: <Products />
        },
        {
            path: '/products/create',
            element: <CreateProducts />
        },
        {
            path: '/products/edit/:id',
            element: <EditProducts />
        },
        {
            path: '/products/:id',
            element: <ViewProducts />
        },
        {
            path: '/orders',
            element: <Orders />
        },
        {
            path: '/money',
            element: <Money />
        },
        {
            path: '/money/edit',
            element: <EditMoney />
        },
        {
            path: '/chats',
            element: <Chats />
        },
        {
            path: '/chatbox',
            element: <ChatBox />
        },
        {
            path: '/user',
            element: <Users />
        }
    ]
};

export default MainRoutes;
