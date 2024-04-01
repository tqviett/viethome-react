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
    FormControlLabel
} from '@mui/material';
// components
import Iconify from 'components/iconify';
import Scrollbar from 'components/scrollbar';
import { ColorMultiPicker } from 'components/color-utils';
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';

// ----------------------------------------------------------------------

export const FILTER_TYPE_OPTIONS = ['Phòng trọ', 'Nhà trọ', 'Chung cư mini'];
export const FILTER_DISTRICT_OPTIONS = ['A', 'B', 'C', 'D'];
export const FILTER_PRICE_OPTIONS = [
    { value: 'below', label: 'Dưới 3tr' },
    { value: 'between', label: 'Từ 3tr-5tr' },
    { value: 'above', label: 'Trên 5tr' }
];
// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
    openFilter: PropTypes.bool,
    onOpenFilter: PropTypes.func,
    onCloseFilter: PropTypes.func
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter }) {
    return (
        <>
            <Button disableRipple color="inherit" onClick={onOpenFilter}>
                <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
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
                            <Typography variant="subtitle1" gutterBottom>
                                Loại phòng
                            </Typography>
                            <FormGroup>
                                {FILTER_TYPE_OPTIONS.map((item) => (
                                    <FormControlLabel key={item} control={<Checkbox />} label={item} />
                                ))}
                            </FormGroup>
                        </div>

                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Khu vực
                            </Typography>
                            <RadioGroup>
                                {FILTER_DISTRICT_OPTIONS.map((item) => (
                                    <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                                ))}
                            </RadioGroup>
                        </div>

                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Giá
                            </Typography>
                            <RadioGroup>
                                {FILTER_PRICE_OPTIONS.map((item) => (
                                    <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
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
                        startIcon={<Iconify icon="ic:round-clear-all" />}
                    >
                        Loại bỏ lọc
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
