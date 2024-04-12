// assets
import { IconListCheck, IconMoneybag, IconFiles, IconMessageDots, IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconFiles,
    IconListCheck,
    IconMoneybag,
    IconMessageDots,
    IconUsers
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const management = {
    id: 'management',
    title: 'Quản lí',
    type: 'group',
    children: [
        {
            id: 'product',
            title: 'Quản lý tin rao',
            type: 'item',
            url: '/admin/ManageProducts',
            icon: icons.IconFiles,
            breadcrumbs: false
        },
        {
            id: 'orders',
            title: 'Quản lý người dùng',
            type: 'item',
            url: '/admin/ManageUsers',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ]
};

export default management;
