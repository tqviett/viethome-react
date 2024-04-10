import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Card, Stack, Table, Button, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';

import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import { TableNoData, ProductTableRow, ProductTableHead, TableEmptyRows, ProductTableToolbar } from 'ui-component/products';
import { emptyRows, applyFilter, getComparator } from 'ui-component/Utils';

import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';

// ----------------------------------------------------------------------

export default function ProductsPage() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(3);

    const [products, setProducts] = useState([]);

    //Function

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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updatedProducts = products.map((product) => {
                if (product.id === id) {
                    return { ...product, status: newStatus };
                }
                return product;
            });
            setProducts(updatedProducts);
            const userDocRef = doc(firestore, 'products', id);
            await updateDoc(userDocRef, { status: newStatus });
            NotificationManager.success('Cập nhật trạng thái sản phẩm thành công!', 'Thông báo');
        } catch (error) {
            NotificationManager.error('Cập nhật trạng thái sản phẩm không thành công!', 'Thông báo');
            console.error('Error updating user status:', error);
        }
    };

    return (
        <Container>
            <Card>
                <ProductTableToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                <Scrollbar sx={{ maxHeight: '60vh' }}>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <ProductTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={products.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: '' },
                                    { id: 'name', label: 'Tên' },
                                    { id: 'description', label: 'Mô tả' },
                                    { id: 'images', label: 'Hình ảnh' },
                                    { id: 'price', label: 'Giá (Triệu)' },
                                    { id: 'total', label: 'SL' },
                                    { id: 'type', label: 'Loại' },
                                    { id: 'emailUser', label: 'Người giao' },
                                    { id: 'status', label: 'Status' },
                                    { id: ' ' }
                                ]}
                            />
                            <TableBody sx={{ overflow: 'auto' }}>
                                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <ProductTableRow
                                        key={row.id}
                                        name={row.name}
                                        description={row.description}
                                        images={row.images}
                                        price={row.price}
                                        total={row.total}
                                        type={row.type}
                                        emailUser={row.emailUser}
                                        status={row.status}
                                        id={row.id}
                                        selected={selected.indexOf(row.name) !== -1}
                                        handleClick={(event) => handleClick(event, row.name)}
                                        handleStatusChange={handleStatusChange}
                                    />
                                ))}

                                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, products.length)} />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

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
    );
}
