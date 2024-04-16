import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    TableRow,
    Box,
    TableCell,
    Typography,
    IconButton,
    Modal,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

import { fTwoDigits } from 'utils/formatNumber';

// ----------------------------------------------------------------------
const StyledProductImg = styled('img')({
    top: 10,
    left: 10,
    width: 120,
    height: 120,
    objectFit: 'cover',
    position: 'absolute',
    borderRadius: 10
});

export default function ProductFavorite({ id, name, images, price, total, area, category, handleRemoveFavorite }) {
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [img, setImg] = useState([]);

    const viewProductUrl = window.location.host;

    const navigate = useNavigate();

    const handleSendMessage = () => {
        navigate(`/messages/${id}`, { state: { from: `${viewProductUrl}/product/${id}` } });
    };

    useEffect(() => {
        if (fullScreenImageIndex !== null) {
            const imgs = images.map((image, index) => ({ src: image, index }));
            setImg(imgs);
            setCurrentIndex(imgs.findIndex((images) => images.index === fullScreenImageIndex));
        }
    }, [fullScreenImageIndex]);

    const handleImageClick = (image, index) => {
        setFullScreenImageIndex(index);
    };

    const handleCloseFullScreenImage = () => {
        setFullScreenImageIndex(null);
    };

    const handleKeyDown = (e) => {
        if (img.length === 0) return;

        switch (e.key) {
            case 'ArrowLeft':
                setCurrentIndex((prevIndex) => (prevIndex === 0 ? img.length - 1 : prevIndex - 1));
                break;
            case 'ArrowRight':
                setCurrentIndex((prevIndex) => (prevIndex === img.length - 1 ? 0 : prevIndex + 1));
                break;
            default:
                break;
        }
    };

    const handleRemoveFavoriteClick = () => {
        if (handleRemoveFavorite) {
            handleRemoveFavorite(id);
        }
    };
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

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox">
                <TableCell>
                    <Card sx={{ display: 'flex' }}>
                        <CardMedia sx={{ width: '15%', height: 'auto', padding: 1 }}>
                            <Box sx={{ position: 'relative', alignContent: 'center' }}>
                                {/* Hiển thị ảnh đầu tiên */}
                                <StyledProductImg
                                    src={images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0]}
                                    alt={`product-img-0`}
                                    onClick={() => handleImageClick(images[0], 0)}
                                />
                                {/* Hiển thị số lượng ảnh */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 0,
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: '0 10px 0 10px',
                                        fontSize: '14px'
                                    }}
                                >
                                    {images.length} ảnh
                                </Box>
                            </Box>
                        </CardMedia>

                        <CardContent sx={{ width: '80%' }}>
                            <Grid container spacing={1} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${id}`)}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">{name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">
                                        {area}m2- số lượng: {total}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" color="error">
                                        {fTwoDigits(price)}Triệu/Tháng
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">
                                        {location}, {ward}, {district}, Hà Nội
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ width: '20%' }}>
                            <Button color="error" size="small" onClick={handleRemoveFavoriteClick}>
                                bỏ thích
                            </Button>
                            <Button color="secondary" size="small" onClick={handleSendMessage}>
                                Chat
                            </Button>
                        </CardActions>
                    </Card>
                </TableCell>
            </TableRow>
            <Modal open={fullScreenImageIndex !== null} onClose={handleCloseFullScreenImage} onKeyDown={handleKeyDown}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <IconButton style={{ position: 'absolute', top: 10, right: 10, color: '#fff' }} onClick={handleCloseFullScreenImage}>
                        <CloseIcon />
                    </IconButton>
                    {img.length > 0 && (
                        <img src={img[currentIndex].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                </div>
            </Modal>
        </>
    );
}

ProductFavorite.propTypes = {
    name: PropTypes.string,
    images: PropTypes.array,
    price: PropTypes.string,
    total: PropTypes.string,
    area: PropTypes.string,
    category: PropTypes.any,
    handleClick: PropTypes.func,
    id: PropTypes.string,
    handleRemoveFavorite: PropTypes.func
};
