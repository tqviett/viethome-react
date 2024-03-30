import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing- ADMIN ROUTING
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/ManageProducts')));

// utilities routing

//---------------------------PUBLIC ROUTE IMPORT----------------------------------------
const Products = Loadable(lazy(() => import('views/utilities/Products')));
const ViewProducts = Loadable(lazy(() => import('views/utilities/Products/viewProduct')));
const NotFound = Loadable(lazy(() => import('views/error')));

//---------------------------USER ROUTE IMPORT----------------------------------------
//USER product
const MyProduct = Loadable(lazy(() => import('views/utilities/Users/Products')));
const CreateMyProducts = Loadable(lazy(() => import('views/utilities/Users/Products/createProduct')));
const EditMyProducts = Loadable(lazy(() => import('views/utilities/Users/Products/editProduct')));
//USER profile
const Users = Loadable(lazy(() => import('views/utilities/Users/profile')));

//
const Money = Loadable(lazy(() => import('views/dashboard/Money')));
const EditMoney = Loadable(lazy(() => import('views/dashboard/Money/editMoney')));
//utilities routing chat and user
const Chats = Loadable(lazy(() => import('views/utilities/ChatApp')));

// sample page routing
const Orders = Loadable(lazy(() => import('views/utilities/Orders')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        //-----------public-----------
        {
            path: '/',
            element: <Products />
        },
        {
            path: '/home',
            element: <Products />
        },
        {
            path: '/product/:id',
            element: <ViewProducts />
        },
        {
            path: '/page-not-found',
            element: <NotFound />
        },
        {
            path: '/profile',
            element: <Users />
        },
        {
            path: '/messages',
            element: <Chats />
        },

        //-----------admin-----------
        {
            path: '/admin/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/admin/ManageProducts',
            element: <DashboardDefault />
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

        //-----------user-----------

        {
            path: '/user/my-products',
            element: <MyProduct />
        },
        {
            path: '/user/product/create',
            element: <CreateMyProducts />
        },
        {
            path: '/user/product/edit/:id',
            element: <EditMyProducts />
        }
    ]
};

export default MainRoutes;
