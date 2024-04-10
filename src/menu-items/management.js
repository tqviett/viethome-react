// assets
import { IconListCheck, IconMoneybag, IconBuildingStore, IconMessageDots, IconUser } from '@tabler/icons';

// constant
const icons = {
    IconBuildingStore,
    IconListCheck,
    IconMoneybag,
    IconMessageDots,
    IconUser
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const management = {
    id: 'management',
    title: 'Quản lí',
    type: 'group',
    children: [
        {
            id: 'product',
            title: 'Sản phẩm',
            type: 'item',
            url: '/admin/ManageProducts',
            icon: icons.IconBuildingStore,
            breadcrumbs: false
        },
        {
            id: 'orders',
            title: 'Người dùng',
            type: 'item',
            url: '/admin/ManageUsers',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default management;
