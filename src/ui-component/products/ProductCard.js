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
    const { name, images, price, id, category } = product;
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
    const sold = categoryObject.sold;

    return (
        <Card onClick={() => navigate(`/product/${id}`)}>
            {renderImages()}

            <Stack spacing={2} sx={{ p: 3 }}>
                <Link color="inherit" underline="hover">
                    <Typography variant="subtitle1" noWrap>
                        {name}
                    </Typography>
                </Link>

                <Stack direction="row" justifyContent="space-between">
                    {/* Price */}
                    <Typography variant="subtitle1">{fCurrency(price)} VNĐ</Typography>

                    {/* Sold */}
                    <Typography variant="subtitle2">Đã bán: {sold}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
