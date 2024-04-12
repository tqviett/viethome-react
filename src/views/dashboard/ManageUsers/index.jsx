import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Card, Stack, Table, Button, TableBody, TableContainer, TablePagination } from '@mui/material';

import { users } from '../../../_mock/user';
import Scrollbar from '../../../components/scrollbar';

import { TableNoData, UserTableRow, UserTableHead, TableEmptyRows, UserTableToolbar } from 'ui-component/manageUsers';
import { emptyRows, applyFilter, getComparator } from 'ui-component/Utils';

import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { NotificationManager } from 'react-notifications';
import { storage, firestore } from '../../../firebase';
import { AuthContext } from 'context/AuthContext';

// ----------------------------------------------------------------------

UserTableToolbar;
export default function UserPage() {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [dataUser, setDataUser] = useState([]);

    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        if (currentUser.role) {
            findUser();
        }
    }, [currentUser.role]);
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('role', '!=', currentUser.role));
            const querySnapshot = await getDocs(q);
            const usersData = [];
            querySnapshot.forEach((doc) => {
                const dataForm = doc.data();
                usersData.push({
                    ...dataForm
                });
            });
            setDataUser(usersData);
        } catch (error) {
            console.error('Error finding users:', error);
        }
    };
    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
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
        inputData: dataUser,
        comparator: getComparator(order, orderBy),
        filterName
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updatedUsers = dataUser.map((user) => {
                if (user.id === id) {
                    return { ...user, status: newStatus };
                }
                return user;
            });
            setDataUser(updatedUsers);
            const userDocRef = doc(firestore, 'users', id);
            await updateDoc(userDocRef, { status: newStatus });
            NotificationManager.success('Cập nhật trạng thái người dùng thành công!', 'Thông báo');
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>QUẢN LÝ NGƯỜI DÙNG | VIET-HOME </title>
            </Helmet>

            <Card>
                <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

                <Scrollbar sx={{ maxHeight: '50vh' }}>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={dataUser.length}
                                onRequestSort={handleSort}
                                headLabel={[
                                    { id: '' },
                                    { id: 'name', label: 'Họ và Tên' },
                                    { id: 'email', label: 'Email' },
                                    { id: 'password', label: 'Mật khẩu' },
                                    { id: 'phone', label: 'Số điện thoại' },
                                    { id: 'role', label: 'Vai trò' },
                                    { id: 'status', label: 'Trạng thái' },
                                    { id: ' ' }
                                ]}
                            />
                            <TableBody>
                                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <UserTableRow
                                        key={row.id}
                                        name={row.name}
                                        password={row.password}
                                        phone={row.phone}
                                        role={row.role}
                                        email={row.email}
                                        avatar={row.avatar}
                                        status={row.status}
                                        id={row.id}
                                        selected={selected.indexOf(row.name) !== -1}
                                        handleClick={(event) => handleClick(event, row.name)}
                                        handleStatusChange={handleStatusChange} // Truyền hàm handleStatusChange xuống
                                    />
                                ))}

                                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, dataUser.length)} />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={dataUser.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
