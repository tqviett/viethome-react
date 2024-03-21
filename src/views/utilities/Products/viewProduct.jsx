import React, { useState, useEffect } from 'react';
import {
    Container,
    Stack,
    Typography,
    Box,
    Button,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Grid,
    Avatar,
    Divider
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
import { Helmet } from 'react-helmet-async';
import { styled, useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'absolute'
});

const ViewProduct = () => {
    const theme = useTheme();
    const [productData, setProductData] = useState({});
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [activeStep, setActiveStep] = React.useState(0);

    const fetchProductData = async () => {
        try {
            const snap = await getDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id));
            if (snap.exists()) {
                setProductData(snap.data());
            } else {
                console.log('No such document');
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params?.id) {
            fetchProductData();
        }
    }, [params]);

    if (loading) {
        return (
            <Container>
                <Stack alignItems="center" justifyContent="center" height="70vh">
                    <CircularProgress />
                </Stack>
            </Container>
        );
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderImages = () => {
        const images = productData.images;
        const maxSteps = images.length;

        return (
            <Box sx={{ flexGrow: 1 }}>
                {maxSteps > 0 && (
                    <div>
                        {images.map((image, index) => (
                            <div key={index} style={{ display: index === activeStep ? 'block' : 'none' }}>
                                <Box sx={{ pt: '60%', position: 'relative' }}>
                                    <StyledProductImg
                                        src={image} // Sử dụng đường dẫn hình ảnh từ mảng images
                                        alt={index}
                                    />
                                </Box>
                            </div>
                        ))}
                    </div>
                )}
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                            Ảnh tiếp
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                            Ảnh trước
                        </Button>
                    }
                />
            </Box>
        );
    };

    const categoryJson = productData.category;
    let categoryArray;
    try {
        categoryArray = JSON.parse(categoryJson);
    } catch (e) {
        console.error('Error parsing category JSON:', e);
        return null;
    }
    const categoryObject = categoryArray[0];

    return (
        <>
            <Helmet>
                <title> Dashboard: Product-info | VIET-HOME </title>
            </Helmet>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Xem sản phẩm
                </Typography>
                <Stack
                    sx={{
                        border: '1px solid #ffff',
                        p: 3,
                        backgroundColor: '#ffff'
                    }}
                    direction="row"
                    flexWrap="wrap-reverse"
                    alignItems="flex-end"
                    justifyContent="space-between"
                >
                    <Stack
                        sx={{
                            border: '1px solid #ffff',
                            borderRadius: 1,
                            display: 'flex'
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                display: 'flex',
                                width: 700,
                                height: 480,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                mb: 2
                            }}
                        >
                            <Stack direction="column" justifyContent="center" alignItems="center">
                                <Card sx={{ width: 650, height: 425 }}>
                                    <CardMedia sx={{ width: '100%', height: '100%' }}>{renderImages()}</CardMedia>
                                </Card>
                                <Card sx={{ height: 50 }}>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Stack>
                        </Stack>

                        <Stack
                            sx={{
                                width: 700,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                height: 'auto',
                                display: 'flex'
                            }}
                        >
                            <CardContent>
                                <Typography variant="h1" sx={{ mb: 1 }}>
                                    Tên sản phẩm: {productData.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Số lượng: {categoryObject.total}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Số lượng đã bán: {categoryObject.sold}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Giá: {productData.price} VNĐ
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Loại sản phẩm: {categoryObject.category}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Ghi chú: {productData.note}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Mô tả: {productData.description}
                                </Typography>
                            </CardContent>

                            {/* //cần sửa quyền ẩn hiện nút CHỈNH SỬA */}
                            <Stack justifyContent="right" alignItems="center" direction="row" spacing={1} sx={{ display: 'flex' }}>
                                <Button component={Link} to={`/user/product/edit/${params.id}`} variant="contained" color="primary">
                                    Chỉnh sửa
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={2}></Stack>
                    </Stack>

                    <Stack
                        sx={{
                            width: '35%'
                        }}
                    >
                        <Box
                            component="form"
                            sx={{
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                '& .MuiTextField-root': { mb: 4, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <CardContent>
                                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                    <Avatar sx={{ height: '80px', width: '80px' }} />
                                    <Stack spacing={1} sx={{ textAlign: 'center' }}>
                                        <Typography variant="h5">abc</Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            abc
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            abc
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default ViewProduct;
