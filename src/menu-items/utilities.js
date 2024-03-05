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
        },
        {
            id: 'chat',
            title: 'Tin nhắn',
            type: 'item',
            url: '/chats',
            icon: icons.IconMessageDots,
            breadcrumbs: false
        }
    ]
};

export default utilities;
