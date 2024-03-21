import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { FIRESTORE } from '../../../constants';
import dayjs from 'dayjs';

const TAX_RATE = 0.0;

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
    return qty * unit;
}

function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
}

function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [createRow('Paperclips (Box)', 100, 1.15), createRow('Paper (Case)', 10, 45.99), createRow('Waste Basket', 2, 17.99)];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

const converTime = (time) => `${new Date(time).getMonth() + 1}-${new Date(time).getFullYear()}`;

export default function SpanningTable() {
    const navigate = useNavigate();
    const [dataList, setDataList] = React.useState([]);
    const [month, setMonth] = React.useState(dayjs(new Date()));

    const findAll = async (month = converTime(new Date())) => {
        const q = query(collection(firestore, FIRESTORE.MONEY), where('time', '==', month));
        const querySnapshot = await getDocs(q);
        const res = [];
        querySnapshot.forEach((money) => {
            res.push({
                ...money?.data()
            });
        });
        if (res[0]?.data) {
            const newData = JSON.parse(res[0].data);
            setDataList(newData);
        } else setDataList([]);
    };

    React.useEffect(() => {
        findAll();
    }, []);

    return (
        <Box>
            <Typography variant="h2" component="h2">
                Quản lí thu chi tháng {new Date().getMonth() + 1}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    views={['year', 'month']}
                    label="Chọn tháng"
                    value={month}
                    onChange={(time) => {
                        findAll(converTime(time));
                        setMonth(time);
                    }}
                    renderInput={(params) => <TextField {...params} helperText={null} />}
                    sx={{ marginTop: 3 }}
                />
            </LocalizationProvider>
            <br />
            <Button
                onClick={() => navigate(`/money/edit?time=${converTime(month)}`)}
                color="secondary"
                variant="contained"
                endIcon={<EditIcon />}
                sx={{ width: 130, mb: 2, mt: 2 }}
            >
                Chỉnh sửa
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={3}>
                                Chi tiết chi tiêu tháng {new Date().getMonth() + 1}
                            </TableCell>
                            <TableCell align="right">Tổng tiền</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Mục</TableCell>
                            <TableCell align="right">Số lượng</TableCell>
                            <TableCell align="right">Đơn vị (VNĐ)</TableCell>
                            <TableCell align="right">Tổng (VNĐ)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList?.map((row, index) => (
                            <TableRow key={row.index} sx={{ backgroundColor: '#fff8e1' }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: 16 }}>{row.name}</TableCell>
                                <TableCell align="right">{row.qty}</TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    {row.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Tổng</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {dataList
                                    .reduce((sum, item) => sum + Number(item.price || 0), 0)
                                    .toString()
                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Phí</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {ccyFormat(invoiceTaxes)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Tổng tiền</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {dataList
                                    .reduce((sum, item) => sum + Number(item.price || 0), 0)
                                    .toString()
                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
