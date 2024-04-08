import { useState } from 'react';
// @mui
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
    { value: 'Newest', label: 'Đăng gần đây' },
    { value: 'priceDesc', label: 'Giá: Giảm dần' },
    { value: 'priceAsc', label: 'Giá: Tăng dần' }
];

export default function ShopProductSort({ onSortChange }) {
    const [open, setOpen] = useState(null);
    const [selectedSortBy, setSelectedSortBy] = useState('Newest'); // State lưu giữ lựa chọn hiện tại

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleSort = (sortBy) => {
        setSelectedSortBy(sortBy); // Cập nhật lựa chọn hiện tại
        onSortChange(sortBy);
        setOpen(null);
    };

    return (
        <>
            <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
                sx={{ with: '200px' }}
            >
                Sắp xếp:&nbsp;
                <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary', width: '100px' }}>
                    {SORT_BY_OPTIONS.find((option) => option.value === selectedSortBy)?.label} {/* Hiển thị lựa chọn đã chọn */}
                </Typography>
            </Button>
            <Menu
                keepMounted
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {SORT_BY_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === selectedSortBy}
                        onClick={() => handleSort(option.value)}
                        sx={{ typography: 'body2' }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
