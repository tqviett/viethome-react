import React, { useState, useEffect } from 'react';

// @mui
import { Stack, Divider, Typography, List, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
// components
import { districtApi, wardApi } from 'api/clients/provinceService';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ShopFilterDistrict() {
    const [district, setDistrict] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublicDistrict = async () => {
            const response = await districtApi();
            if (response.status === 200) {
                const dataDistrict = response.data;
                const districts = dataDistrict.results.map((district) => ({
                    id: district.district_id,
                    name: district.district_name
                }));
                setDistrict(districts);
            }
        };
        fetchPublicDistrict();
    }, []);

    const handleClickDistrict = (key, value) => {
        if (key === 'district') {
            navigate(`/products/${value.id}`);
        }
    };

    return (
        <>
            <Stack sx={{ p: 1, borderRadius: '10px' }}>
                <Typography variant="h4" gutterBottom>
                    Xem theo Quận, Huyện:
                </Typography>
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 500,
                        '& ul': { padding: 0 }
                    }}
                >
                    {district.map((district) => (
                        <ListItemButton id="district" key={district.id} onClick={() => handleClickDistrict('district', district)}>
                            <ListItemText primary={<Typography variant="body1">{`> Cho thuê khu vực ${district.name}`}</Typography>} />
                        </ListItemButton>
                    ))}
                </List>
            </Stack>
        </>
    );
}
