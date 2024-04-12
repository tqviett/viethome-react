import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from 'ui-component/products';
// mock
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { FIRESTORE } from '../../../../constants';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function ProductsPage() {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        district: '',
        ward: '',
        price: ''
    });

    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const email = userInfo?.email;

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };
    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };
    const findAll = async () => {
        const docRefs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
        const res = [];
        docRefs.forEach((product) => {
            const categories = JSON.parse(product.data().category);
            const data = product.data();
            if (data.emailUser === email) {
                if (
                    (filters.type === '' || product.data().type.value === filters.type) &&
                    (filters.district === '' || categories[0].district === filters.district) &&
                    (filters.ward === '' || categories[0].ward === filters.ward) &&
                    (filters.price === '' ||
                        (filters.price === 'below' && product.data().price < 3000000) ||
                        (filters.price === 'between' && product.data().price >= 3000000 && product.data().price <= 5000000) ||
                        (filters.price === 'above' && product.data().price > 5000000))
                ) {
                    res.push({
                        ...product.data(),
                        id: product.id
                    });
                }
            }
        });
        setProducts(res);
        return res;
    };

    useEffect(() => {
        findAll();
    }, [filters]);
    const handleSortChange = async (sortBy) => {
        let sortedProducts = [];

        if (sortBy === 'Newest') {
            // Sắp xếp theo mới nhất
            sortedProducts = products.slice().sort((a, b) => b.created_at - a.created_at);
        } else if (sortBy === 'priceDesc') {
            // Sắp xếp theo giá giảm dần
            sortedProducts = products.slice().sort((a, b) => b.price - a.price);
        } else if (sortBy === 'priceAsc') {
            // Sắp xếp theo giá tăng dần
            sortedProducts = products.slice().sort((a, b) => a.price - b.price);
        }

        setProducts(sortedProducts);
    };

    return (
        <>
            <Helmet>
                <title> TIN ĐÃ ĐĂNG | VIET-HOME </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}></Typography>

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Button color="secondary" variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/user/product/create')}>
                        Thêm mới sản phẩm
                    </Button>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                        <ProductFilterSidebar
                            bar
                            openFilter={openFilter}
                            onOpenFilter={handleOpenFilter}
                            onCloseFilter={handleCloseFilter}
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                        />
                        <ProductSort onSortChange={handleSortChange} />
                    </Stack>
                </Stack>

                <ProductList products={products} />
            </Container>
        </>
    );
}
