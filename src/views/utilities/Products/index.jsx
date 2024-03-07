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
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function ProductsPage() {
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [products, setProducts] = useState([]);

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const findAll = async () => {
        const doc_refs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
        const res = [];
        doc_refs.forEach((product) => {
            res.push({
                ...product.data(),
                id: product.id
            });
        });
        setProducts(res);
        return res;
    };

    useEffect(() => {
        findAll();
    }, []);

    return (
        <>
            <Helmet>
                <title> Dashboard: Products | viet-home </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Sảm phẩm
                </Typography>

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Button color="secondary" variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/products/create')}>
                        Thêm mới sản phẩm
                    </Button>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                        {/* <ProductFilterSidebar
                            bar
                            openFilter={openFilter}
                            onOpenFilter={handleOpenFilter}
                            onCloseFilter={handleCloseFilter}
                        />
                        <ProductSort /> */}
                    </Stack>
                </Stack>

                <ProductList products={products} />
                <ProductCartWidget />
            </Container>
        </>
    );
}
