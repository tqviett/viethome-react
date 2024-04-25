import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Popover, TableRow, Box, MenuItem, TableCell, Typography, IconButton, ImageList, ImageListItem, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '../../components/label';
import Iconify from '../../components/iconify';
import CloseIcon from '@mui/icons-material/Close';

import { fTwoDigits } from 'utils/formatNumber';

// ----------------------------------------------------------------------
const StyledProductImg = styled('img')({
    top: 0,
    width: 80,
    height: 80,
    objectFit: 'cover',
    position: 'absolute'
});

export default function ProductTableRow({ id, name, description, images, price, total, type, emailUser, status, handleStatusChange }) {
    const [open, setOpen] = useState(null);

    const [fullScreenImageIndex, setFullScreenImageIndex] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [img, setImg] = useState([]);
    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };
    const descriptionSetHtml = () => {
        return { __html: description };
    };

    useEffect(() => {
        // Set images array when fullScreenImage changes
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

    const handleChangeStatus = (newStatus) => {
        handleStatusChange(id, newStatus);
        handleCloseMenu();
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox">
                <TableCell></TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant="body1" sx={{ maxWidth: '140px', maxHeight: '15vh', overflow: 'auto' }}>
                        {name}
                    </Typography>
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
                    <Typography variant="body1" sx={{ maxWidth: '180px', maxHeight: '15vh', overflow: 'auto' }}>
                        <span dangerouslySetInnerHTML={descriptionSetHtml()} />
                    </Typography>
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
                    <ImageList sx={{ width: '200px', height: '15vh' }} cols={2} rowHeight={90}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: 'relative' }}>
                                <ImageListItem>
                                    {image instanceof File ? (
                                        <StyledProductImg
                                            src={URL.createObjectURL(image)}
                                            alt={`product-img-${index}`}
                                            onClick={() => handleImageClick(image, index)}
                                        />
                                    ) : (
                                        <StyledProductImg
                                            src={image}
                                            alt={`product-img-${index}`}
                                            onClick={() => handleImageClick(image, index)}
                                        />
                                    )}
                                </ImageListItem>
                            </Box>
                        ))}
                    </ImageList>
                </TableCell>

                <TableCell sx={{ width: 100 }}>{fTwoDigits(price)}</TableCell>

                <TableCell>{total}</TableCell>

                <TableCell>{type.label}</TableCell>

                <TableCell>{emailUser}</TableCell>

                <TableCell>
                    <Label color={status === 'pending' ? 'warning' : status === 'banned' ? 'error' : 'success'}>{status}</Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
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

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 }
                }}
            >
                <MenuItem onClick={() => handleChangeStatus('active')} sx={{ color: 'success.main', textAlign: 'center' }}>
                    active
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus('pending')} sx={{ color: 'warning.main' }}>
                    pending
                </MenuItem>
                <MenuItem onClick={() => handleChangeStatus('banned')} sx={{ color: 'error.main' }}>
                    banned
                </MenuItem>
            </Popover>
        </>
    );
}

ProductTableRow.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.array,
    price: PropTypes.string,
    total: PropTypes.string,
    type: PropTypes.object,
    emailUser: PropTypes.string,
    handleClick: PropTypes.func,
    status: PropTypes.string,
    id: PropTypes.string,
    handleStatusChange: PropTypes.func
};
