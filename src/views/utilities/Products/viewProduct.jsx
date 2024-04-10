import React, { useState, useEffect, useContext } from 'react';
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
    Divider,
    ListItemText,
    ListItemButton,
    ListItemIcon
} from '@mui/material';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getDoc, doc, getDocs, query, collection, where } from 'firebase/firestore';

import { Helmet } from 'react-helmet-async';
import { styled, useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { IconMessage } from '@tabler/icons';
import HomeIcon from '@mui/icons-material/Home';

// context
import { AuthContext } from 'context/AuthContext';

//Ui-Component
import { ProductList, ProductFilterType } from 'ui-component/products';
import { ProductFilterView } from 'ui-component/products';

import NotFoundView from 'views/error';
import { fTwoDigits } from 'utils/formatNumber';
import { formatDate } from 'utils/formatDate';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';

//google Map
import Map from 'ui-component/Map';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

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
    const { currentUser } = useContext(AuthContext);
    const [dataUser, setDataUser] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [coords, setCoords] = useState(null);

    const viewProductUrl = window.location.href;
    const handleSendMessage = () => {
        navigate(`/messages/${params.id}`, { state: { from: viewProductUrl } });
    };

    useEffect(() => {
        if (productData.emailUser) {
            findUser();
        }
    }, [productData.emailUser]);

    //Function
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', productData.emailUser));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setDataUser({
                    ...data,
                    avatar: data.avatar
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };
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
    const findProductbyUser = async () => {
        try {
            const docRefs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
            const res = [];

            docRefs.forEach((product) => {
                const data = product.data();
                if (data.emailUser === dataUser.email && product.id !== params.id) {
                    res.push({
                        ...data,
                        id: product.id
                    });
                }
            });

            setProducts(res);
            return res;
        } catch (error) {
            console.error('Error finding products by user:', error);
            return <NotFoundView />;
        }
    };

    useEffect(() => {
        findProductbyUser();
    }, [dataUser.email, params.id]);

    // useEffect(() => {
    //     // const positionObj = JSON.parse(productData.category);
    //     // const position = `${positionObj[0].location}, ${positionObj[0].ward}, ${positionObj[0].district}, Hà Nội`;
    //     const add = 'Hà Nội';
    //     const getCoords = async () => {
    //         const results = await geocodeByAddress('add');
    //         console.log('Geocode results:', results);
    //     };
    //     getCoords();
    // }, []);

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
                    variant="text"
                    sx={{
                        color: 'secondary.main' // Đổi màu chữ thành màu chính của secondary
                    }}
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" color="secondary" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                            Ảnh tiếp
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small" color="secondary" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                            Ảnh trước
                        </Button>
                    }
                />
            </Box>
        );
    };

    let categoryArray;
    try {
        categoryArray = JSON.parse(productData.category);
    } catch (e) {
        console.error('Error parsing category JSON:', e);
        return null;
    }
    //Map with category
    const categoryObject = categoryArray[0];
    const location = categoryObject.location;
    const district = categoryObject.district;
    const ward = categoryObject.ward;

    const descriptionSetHtml = () => {
        return { __html: productData.description };
    };
    return (
        <>
            <Helmet>
                <title> Dashboard: Product-info | VIET-HOME </title>
            </Helmet>
            <Container>
                {/* <Typography variant="h4" sx={{ mb: 5 }}>
                    Thông tin chi tiết:
                </Typography> */}
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
                                        <Button color="secondary" size="small">
                                            Chia sẻ
                                        </Button>
                                        <Button color="secondary" size="small">
                                            Yêu thích
                                        </Button>
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
                                <Typography variant="h1" sx={{ mb: 1 }} color="secondary">
                                    Tên sản phẩm: {productData.name}
                                </Typography>
                                {currentUser.email === productData.emailUser && (
                                    <Stack justifyContent="right" alignItems="center" direction="row" spacing={1} sx={{ display: 'flex' }}>
                                        <Button color="primary" component={Link} to={`/user/product/edit/${params.id}`} variant="contained">
                                            Chỉnh sửa
                                        </Button>
                                    </Stack>
                                )}
                                <HomeIcon fontSize="10px" sx={{ mr: 1 }} />
                                Chuyên mục :
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 2 }}
                                    color="primary"
                                    component={Link}
                                    to={`/products/${productData.type.value}`}
                                >
                                    {productData.type.label}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1, mt: 1 }}>
                                    <LocationOnIcon fontSize="body1" color="primary" sx={{ mr: 1 }} />
                                    Địa chỉ:{location}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 2, mt: 1 }}>
                                    <PaidIcon fontSize="body1" color="error" sx={{ mr: 1 }} /> {/* Thay errorColor bằng màu của error */}
                                    Giá: {fTwoDigits(productData.price)} Triệu/Tháng
                                    <AspectRatioIcon fontSize="body1" sx={{ ml: 2, mr: 1 }} color="success" />
                                    {productData.area} m²
                                </Typography>
                                <Typography variant="h4" component="h2" sx={{ mt: 3 }}>
                                    Mô tả chi tiết:
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <span dangerouslySetInnerHTML={descriptionSetHtml()} />
                                </Typography>
                                <Typography variant="h4" component="h2" sx={{ mt: 3, mb: 2 }}>
                                    Đặc điểm tin đăng:
                                </Typography>
                                <Grid container spacing={2} sx={{ backgroundColor: '#f0f0f0', marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Khu vực :
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            cho thuê phòng trọ tại {district}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Loại tin rao:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {productData.type.label}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ backgroundColor: '#f0f0f0', marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Đối tượng :
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Tất cả mọi người
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Ngày đăng:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {formatDate(productData.created_at)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ backgroundColor: '#f0f0f0', marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Ghi chú:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {productData.note}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h4" component="h2" sx={{ mt: 3, mb: 2 }}>
                                    Thông tin liên hệ:
                                </Typography>
                                <Grid container spacing={2} sx={{ backgroundColor: '#f0f0f0', marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Liên hệ :
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {dataUser.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Số điện thoại:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {dataUser.phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ backgroundColor: '#f0f0f0', marginBottom: 2, alignItems: 'center' }}>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Zalo:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            {dataUser.phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h4" component="h2" sx={{ mt: 3, mb: 2 }}>
                                    Bản Đồ:
                                </Typography>
                                <Typography variant="body1" component="h2" sx={{ mt: 3, mb: 2 }}>
                                    Địa chỉ: {location}, {ward}, {district}, Hà Nội
                                </Typography>
                                {/* <Map coords={coords} /> */}
                            </CardContent>
                        </Stack>
                        <Stack
                            sx={{
                                marginTop: 2,
                                width: 700,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                height: 'auto',
                                display: 'flex'
                            }}
                        >
                            <Container>
                                <Typography variant="h4" sx={{ mb: 1, mt: 2 }}>
                                    Một số nhà khác được giao bởi {dataUser.name} :
                                </Typography>
                                {products.length > 0 ? (
                                    <>
                                        <ProductList products={products} />
                                    </>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
                                        Hiện tại chưa có nè!!!
                                    </Typography>
                                )}
                            </Container>
                        </Stack>
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
                                    <Avatar sx={{ height: '80px', width: '80px' }} src={dataUser.avatar} />
                                    <Stack spacing={1}>
                                        <Typography variant="h5" sx={{ textAlign: 'center' }}>
                                            {dataUser.name}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'left' }}>
                                            Vai trò: {dataUser.role}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'left' }}>
                                            Số điện thoại: {dataUser.phone}
                                        </Typography>
                                    </Stack>
                                    {currentUser.email !== productData.emailUser && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleSendMessage}
                                            startIcon={<IconMessage stroke={1.5} size="1.3rem" />}
                                        >
                                            Nhắn tin ngay
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Box>
                        <Box
                            component="form"
                            sx={{
                                marginTop: 2,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                '& .MuiTextField-root': { mb: 4, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <CardContent>
                                <ProductFilterType />
                            </CardContent>
                        </Box>
                        <Box
                            component="form"
                            sx={{
                                marginTop: 2,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                '& .MuiTextField-root': { mb: 4, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <CardContent>
                                <ProductFilterView />
                            </CardContent>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default ViewProduct;
