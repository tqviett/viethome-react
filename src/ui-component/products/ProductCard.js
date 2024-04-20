import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, ImageList, ImageListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from 'utils/formatNumber';
// components
import Label from 'components/label';
import { ColorPreview } from 'components/color-utils';
import { useNavigate } from 'react-router-dom';
import Avatar from 'ui-component/extended/Avatar';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
    product: PropTypes.object
};

export default function ShopProductCard({ product }) {
    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const uName = userInfo?.name;

    const { name, images, price, id, category, status } = product;
    const navigate = useNavigate();

    // Function to render single image or array of images
    const renderImages = () => {
        if (Array.isArray(images) && images.length > 0) {
            // Check if images is an array and not empty
            return (
                <Box sx={{ pt: '100%', position: 'relative' }}>
                    <StyledProductImg src={images[0]} alt={name} />;
                </Box>
            );
        } else {
            return null; // Handle other cases or return a default image
        }
    };

    // Parsing and rendering category data
    const categoryJson = category;
    let categoryArray;
    try {
        categoryArray = JSON.parse(categoryJson);
    } catch (e) {
        console.error('Error parsing category JSON:', e);
        return null;
    }
    const categoryObject = categoryArray[0];
    const location = categoryObject.location;
    const district = categoryObject.district;
    const ward = categoryObject.ward;
    let statusLabel;
    if (status === 'pending') {
        statusLabel = 'Chưa duyệt';
    } else if (status === 'banned') {
        statusLabel = 'Bị cấm';
    } else if (status === 'active') {
        statusLabel = 'Uy tín';
    } else {
        statusLabel = 'Không xác định';
    }

    return (
        //phần quyền cho việc CLick
        <Card onClick={() => navigate(`/product/${id}`)}>
            {renderImages()}

            <Stack spacing={2} sx={{ p: 3 }}>
                <Link color="inherit" underline="hover">
                    <Typography variant="subtitle1" rows={2} noWrap>
                        {name}
                    </Typography>
                </Link>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1">{fCurrency(price)} VNĐ/Tháng</Typography>
                    <Label color={status === 'pending' ? 'warning' : status === 'banned' ? 'error' : 'success'}>{statusLabel}</Label>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2" noWrap>
                        {location}, {ward}, {district}, Hà Nội
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
