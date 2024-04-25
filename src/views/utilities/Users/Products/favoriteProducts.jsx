import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Card, Stack, Table, Button, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';

import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';

import { TableNoData, ProductFavorite, ProductTableHead, TableEmptyRows, ProductTableToolbar } from 'ui-component/products';
import { emptyRows, applyFilter, getComparator } from 'ui-component/Utils';

import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';
import { firestore } from '../../../../firebase';
import { FIRESTORE } from '../../../../constants';
import { AuthContext } from 'context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ProductsFavoritePage() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(3);

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const [dataUser, setDataUser] = useState([]);

    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const email = userInfo?.email;

    useEffect(() => {
        findUser();
    }, [email]);
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setDataUser({
                    ...data,
                    favorites: data.favorites
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };

    const findProductFavorite = async (favoriteIds) => {
        const docRefs = await getDocs(collection(firestore, FIRESTORE.PRODUCTS));
        const res = [];
        docRefs.forEach((product) => {
            const data = product.data();
            if (favoriteIds.includes(product.id)) {
                res.push({
                    ...data,
                    id: product.id
                });
            }
        });
        setProducts(res);
        return res;
    };

    useEffect(() => {
        if (dataUser.favorites && dataUser.favorites.length > 0) {
            findProductFavorite(dataUser.favorites);
        }
    }, [dataUser]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = products.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const dataFiltered = applyFilter({
        inputData: products,
        comparator: getComparator(order, orderBy),
        filterName
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleRemoveFavorite = async (productIdToRemove) => {
        try {
            const favorites = dataUser.favorites;
            console.log(favorites);
            if (favorites.includes(productIdToRemove)) {
                // Lọc bỏ sản phẩm khỏi mảng favorites
                const updatedFavorites = favorites.filter((productId) => productId !== productIdToRemove);
                // Lấy tham chiếu đến tài liệu người dùng
                const userRef = doc(firestore, 'users', dataUser.id);
                // Cập nhật lại mảng favorites trong Firestore
                await updateDoc(userRef, { favorites: updatedFavorites });
                // Cập nhật state dataUser để kích hoạt useEffect và cập nhật danh sách sản phẩm
                setDataUser({ ...dataUser, favorites: updatedFavorites });
                NotificationManager.success('Đã bỏ thích sản phẩm');
            } else {
                NotificationManager.error('Không tìm thấy danh sách yêu thích');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            NotificationManager.error('Đã xảy ra lỗi khi bỏ thích sản phẩm');
        }
    };

    return (
        <>
            <Helmet>
                <title> TIN ĐÃ LƯU | VIET-HOME </title>
            </Helmet>

            <Container>
                <Card>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800, maxHeight: 190 }}>
                            <ProductTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={products.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[{ id: 'name', label: 'Tim đã lưu' }]}
                            />
                            <TableBody sx={{ overflow: 'auto' }}>
                                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <ProductFavorite
                                        key={row.id}
                                        name={row.name}
                                        images={row.images}
                                        price={row.price}
                                        total={row.total}
                                        area={row.area}
                                        category={row.category}
                                        id={row.id}
                                        selected={selected.indexOf(row.name) !== -1}
                                        handleClick={(event) => handleClick(event, row.name)}
                                        handleRemoveFavorite={handleRemoveFavorite}
                                    />
                                ))}

                                <TableEmptyRows height={185} emptyRows={emptyRows(page, rowsPerPage, products.length)} />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        page={page}
                        component="div"
                        count={products.length}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[3]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </>
    );
}
