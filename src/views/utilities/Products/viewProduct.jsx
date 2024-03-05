// ViewProduct.jsx
import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, Box, Button, CircularProgress, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';

const ViewProduct = () => {
    const [productData, setProductData] = useState({});
    const [loading, setLoading] = useState(true);
    const params = useParams();

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
        <Container>
            <Typography variant="h4" sx={{ mb: 5 }}>
                Xem sản phẩm
            </Typography>
            <Stack
                sx={{
                    border: '1px solid #ffff',
                    p: 3,
                    backgroundColor: '#ffff',
                    borderRadius: 1,
                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Card>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia component="img" height="270" image={productData.image} alt="Product Image" />
                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                            <CardContent>
                                <Typography variant="h5" sx={{ mb: 1 }}>
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
                        </Box>
                    </Card>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button component={Link} to={`/products/edit/${params.id}`} variant="contained" color="primary">
                        Chỉnh sửa
                    </Button>
                    <Button variant="outlined" color="error" disabled>
                        Xóa sản phẩm
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default ViewProduct;
