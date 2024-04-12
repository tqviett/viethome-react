import React, { useState, useEffect } from 'react';

// @mui
import {
    Box,
    Radio,
    Stack,
    Button,
    Drawer,
    Rating,
    Divider,
    Checkbox,
    FormGroup,
    IconButton,
    Typography,
    RadioGroup,
    ListItemButton,
    List,
    ListItemText
} from '@mui/material';
// components
import { districtApi, wardApi } from 'api/clients/provinceService';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
export const FILTER_TYPE_OPTIONS = [
    { value: 'phongTro', label: 'Phòng trọ' },
    { value: 'nhaTro', label: 'Nhà trọ' },
    { value: 'chungCuMini', label: 'Chung cư mini' }
];

export default function ShopNewUpload() {
    const navigate = useNavigate();

    const handleSelectType = (key, value) => {
        navigate(`/products/${value}`);
    };

    return (
        <>
            <Stack sx={{ p: 1, borderRadius: '10px' }}>
                <Typography variant="h4" gutterBottom>
                    Loại phòng được giao:
                </Typography>
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 700,
                        '& ul': { padding: 0 }
                    }}
                >
                    {FILTER_TYPE_OPTIONS.map((item) => (
                        <ListItemButton key={item.value} value={item.value} onClick={() => handleSelectType('type', item.value)}>
                            <ListItemText primary={<Typography variant="body1">{`> Cho Thuê ${item.label}`}</Typography>} />
                        </ListItemButton>
                    ))}
                </List>
            </Stack>
        </>
    );
}
