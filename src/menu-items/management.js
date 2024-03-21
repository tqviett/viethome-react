// assets
import { IconListCheck, IconMoneybag, IconBuildingStore, IconMessageDots } from '@tabler/icons';

// constant
const icons = {
    IconBuildingStore,
    IconListCheck,
    IconMoneybag,
    IconMessageDots
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
            url: '/products',
            icon: icons.IconBuildingStore,
            breadcrumbs: false
        },
        {
            id: 'orders',
            title: 'Đơn hàng',
            type: 'item',
            url: '/orders',
            icon: icons.IconListCheck,
            breadcrumbs: false
        },
        {
            id: 'moeny',
            title: 'Chi tiêu',
            type: 'item',
            url: '/money',
            icon: icons.IconMoneybag,
            breadcrumbs: false
        }
    ]
};

export default management;
