import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from 'ui-component/products';
// mock
import { useLocation, useParams } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
import { useEffect } from 'react';
import SearchSection from './SearchSection';
// ----------------------------------------------------------------------
export const FILTER_TYPE_OPTIONS = [
    { value: 'phongTro', label: 'Phòng trọ' },
    { value: 'nhaTro', label: 'Nhà trọ' },
    { value: 'chungCuMini', label: 'Chung cư mini' }
];
const listFilters = {
    type: '',
    district: '',
    ward: '',
    price: ''
};
export default function ProductsPage() {
    const params = useParams();
    const [openFilter, setOpenFilter] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState(listFilters);

    useEffect(() => {
        if (params?.id) {
            setFilters((prevFilters) => ({ ...prevFilters, type: params.id }));
        } else {
            setFilters(listFilters);
        }
    }, [params]);

    useEffect(() => {
        findAll();
    }, [filters, searchQuery]);

    // Function to handle filter change
    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };
    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    // handleSortChange
    const handleSortChange = async (sortBy) => {
        let sortedProducts = [];

        if (sortBy === 'Newest') {
            sortedProducts = products.slice().sort((a, b) => b.created_at - a.created_at);
        } else if (sortBy === 'priceDesc') {
            sortedProducts = products.slice().sort((a, b) => b.price - a.price);
        } else if (sortBy === 'priceAsc') {
            sortedProducts = products.slice().sort((a, b) => a.price - b.price);
        }

        setProducts(sortedProducts);
    };

    //handleSearchChange
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // find with ...
    const findAll = async () => {
        // ...
        const doc_refs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
        const res = [];

        doc_refs.forEach((product) => {
            const categories = JSON.parse(product.data().category);
            if (
                (searchQuery.length === 0 || product.data().name.toLowerCase().includes(searchQuery.toLowerCase())) &&
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
        });
        setProducts(res);
    };

    return (
        <>
            <Helmet>
                <title> Dashboard: Products | VIET-HOME </title>
            </Helmet>

            <Container>
                {/* <Typography variant="h4" sx={{ mb: 5 }}>
                    Sảm phẩm
                </Typography> */}

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                        <SearchSection value={searchQuery} onSearchChange={handleSearchChange} />
                        <ProductSort onSortChange={handleSortChange} />
                        <ProductFilterSidebar
                            bar
                            openFilter={openFilter}
                            onOpenFilter={handleOpenFilter}
                            onCloseFilter={handleCloseFilter}
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                        />
                    </Stack>
                </Stack>

                <ProductList products={products} />
            </Container>
        </>
    );
}
