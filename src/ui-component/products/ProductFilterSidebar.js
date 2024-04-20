import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
    FormControlLabel,
    Autocomplete,
    TextField
} from '@mui/material';
// components
import Iconify from 'components/iconify';
import Scrollbar from 'components/scrollbar';
import { ColorMultiPicker } from 'components/color-utils';
import { districtApi, wardApi } from 'api/clients/provinceService';
import { useParams, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export const FILTER_TYPE_OPTIONS = [
    { value: 'phongTro', label: 'Phòng trọ' },
    { value: 'nhaTro', label: 'Nhà trọ' },
    { value: 'chungCuMini', label: 'Chung cư mini' }
];

export const FILTER_PRICE_OPTIONS = [
    { value: 'below', label: 'Dưới 3tr' },
    { value: 'between', label: 'Từ 3tr-5tr' },
    { value: 'between2', label: 'từ 5tr-10tr' },
    { value: 'above', label: 'Trên 10tr' }
];
// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
    openFilter: PropTypes.bool,
    onOpenFilter: PropTypes.func,
    onCloseFilter: PropTypes.func,
    fillFilter: PropTypes.object,
    handleFilterChange: PropTypes.func
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, filters, handleFilterChange }) {
    const [district, setDistrict] = useState([]);
    const [districtIds, setDistrictIds] = useState([]);
    const [ward, setWard] = useState([]);
    const params = useParams();
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
    useEffect(() => {
        const fetchPublicWard = async () => {
            if (districtIds.length) {
                const response = await wardApi(districtIds);
                if (response.status === 200) {
                    const dataWard = response.data;
                    const wards = dataWard.results.map((ward) => ({
                        id: ward.ward_id,
                        name: ward.ward_name
                    }));
                    setWard(wards);
                }
            }
        };
        fetchPublicWard(districtIds);
    }, [districtIds]);
    const handleSelectDistrict = (key, value) => {
        if (key === 'district') {
            const selectedDistrictName = value ? value.name : '';
            const selectedDistrictId = value ? value.id : '';
            setDistrictIds(selectedDistrictId);
            handleFilterChange('district', selectedDistrictName);
        }
    };
    const handleSelectWard = (key, value) => {
        if (key === 'ward') {
            const selectedWardName = value ? value.name : '';
            handleFilterChange('ward', selectedWardName);
        }
    };

    const handleSelectType = (value) => {
        handleFilterChange('type', value);
    };

    const handleSelectPrice = (value) => {
        handleFilterChange('price', value);
    };
    const handleResetFilters = () => {
        handleFilterChange('type', '');
        handleFilterChange('district', '');
        handleFilterChange('ward', '');
        handleFilterChange('price', '');
    };

    return (
        <>
            <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
                Phân loại&nbsp;
            </Button>

            <Drawer
                anchor="right"
                open={openFilter}
                onClose={onCloseFilter}
                PaperProps={{
                    sx: { width: 280, border: 'none', overflow: 'hidden' }
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Phân loại theo:
                    </Typography>
                    <IconButton onClick={onCloseFilter}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Stack>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <div>
                            {!params?.id && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Loại phòng
                                    </Typography>
                                    <RadioGroup value={filters.type}>
                                        {FILTER_TYPE_OPTIONS.map((item) => (
                                            <FormControlLabel
                                                key={item.value}
                                                value={item.value}
                                                control={<Radio />}
                                                label={item.label}
                                                onChange={() => handleSelectType(item.value)}
                                            />
                                        ))}
                                    </RadioGroup>
                                </>
                            )}
                        </div>

                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Quận/Huyện
                            </Typography>
                            <Autocomplete
                                id="district"
                                size="small"
                                options={district}
                                getOptionLabel={(option) => (option ? option.name : '')}
                                clearText=""
                                value={district.find((item) => item.name === filters.district) || null}
                                onChange={(e, value) => handleSelectDistrict('district', value || null)}
                                renderInput={(params) => <TextField {...params} />}
                            />

                            {districtIds !== '' && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Phường/Xã
                                    </Typography>
                                    <Autocomplete
                                        id="ward"
                                        size="small"
                                        options={ward}
                                        getOptionLabel={(option) => (option ? option.name : '')}
                                        clearText=""
                                        onChange={(e, value) => handleSelectWard('ward', value || null)} // Truyền null nếu không có giá trị được chọn
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </>
                            )}
                        </div>

                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Giá
                            </Typography>
                            <RadioGroup value={filters.price}>
                                {FILTER_PRICE_OPTIONS.map((item) => (
                                    <FormControlLabel
                                        key={item.value}
                                        value={item.value}
                                        control={<Radio />}
                                        label={item.label}
                                        onChange={() => handleSelectPrice(item.value)}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 3 }}>
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="outlined"
                        onClick={handleResetFilters}
                        startIcon={<Iconify icon="ic:round-clear-all" />}
                    >
                        Loại bỏ lọc
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
