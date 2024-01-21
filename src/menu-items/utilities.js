// assets
import { IconListCheck, IconMoneybag, IconBuildingStore } from '@tabler/icons';

// constant
const icons = {
    IconBuildingStore,
    IconListCheck,
    IconMoneybag
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'management',
    title: 'Quản lí',
    type: 'group',
    children: [
        {
            id: 'products',
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

export default utilities;
