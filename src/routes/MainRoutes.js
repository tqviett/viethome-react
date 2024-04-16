import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing- ADMIN ROUTING
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/ManageProducts')));
const ManageUser = Loadable(lazy(() => import('views/dashboard/ManageUsers')));

// utilities routing

//---------------------------PUBLIC ROUTE IMPORT----------------------------------------
const Products = Loadable(lazy(() => import('views/utilities/Products')));
const ViewProducts = Loadable(lazy(() => import('views/utilities/Products/viewProduct')));
const NotFound = Loadable(lazy(() => import('views/error')));
const AboutMe = Loadable(lazy(() => import('views/pages/AboutMe')));
const PrivacyPolicy = Loadable(lazy(() => import('views/pages/PrivacyPolicy')));
const ResolveComplaints = Loadable(lazy(() => import('views/pages/ResolveComplaints')));
const TermsOfUse = Loadable(lazy(() => import('views/pages/TermsOfUse')));

//profile
const Users = Loadable(lazy(() => import('views/utilities/Users/profile')));

//utilities routing chat and user
const Chats = Loadable(lazy(() => import('views/utilities/ChatApp')));

//---------------------------USER ROUTE IMPORT----------------------------------------
//USER product
const MyProduct = Loadable(lazy(() => import('views/utilities/Users/Products')));
const CreateMyProducts = Loadable(lazy(() => import('views/utilities/Users/Products/createProduct')));
const EditMyProducts = Loadable(lazy(() => import('views/utilities/Users/Products/editProduct')));
const FavoriteProduct = Loadable(lazy(() => import('views/utilities/Users/Products/favoriteProducts')));

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
            path: '/product',
            element: <Products />
        },
        {
            path: '/products/:id',
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
        {
            path: '/messages/:id',
            element: <Chats />
        },
        {
            path: '/about-me',
            element: <AboutMe />
        },
        {
            path: '/privacy-policy',
            element: <PrivacyPolicy />
        },
        {
            path: '/resolve-complaints',
            element: <ResolveComplaints />
        },
        {
            path: '/terms-of-use',
            element: <TermsOfUse />
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
            path: '/admin/ManageUsers',
            element: <ManageUser />
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
        },
        {
            path: '/user/favorites',
            element: <FavoriteProduct />
        }
    ]
};

export default MainRoutes;
