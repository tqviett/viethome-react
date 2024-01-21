import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { NotificationManager } from 'react-notifications';
import { firestore } from '../../../firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { FIRESTORE } from '../../../constants';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function EditMoney(props) {
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryTime = searchParams.get('time');
    const [dataForm, setDataForm] = React.useState([]);
    const handleChangeInput = (id, key, value) => {
        const newData = [...dataForm];
        const findIndex = newData.findIndex((x) => x.id == id);
        if (findIndex > -1) {
            newData[findIndex][key] = value;
            newData[findIndex]['price'] = newData[findIndex]['qty'] * newData[findIndex]['unit'];
        }
        setDataForm(newData);
    };
    const handleAddItem = () => setDataForm([...dataForm, { id: new Date().getTime(), name: '', unit: '', total: 0 }]);

    const handleRemoveCategory = (id) => {
        const newList = [...dataForm].filter((item) => item.id !== id);
        setDataForm([...newList]);
    };
    const findAll = async () => {
        const q = query(collection(firestore, FIRESTORE.MONEY), where('time', '==', queryTime));
        const querySnapshot = await getDocs(q);
        const res = [];
        querySnapshot.forEach((money) => {
            res.push({
                ...money?.data()
            });
        });
        if (res[0]?.data) {
            const newData = JSON.parse(res[0].data);
            setDataForm(newData);
        } else setDataForm([]);
    };

    React.useEffect(() => {
        if (queryTime) findAll();
    }, [queryTime]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!dataForm.every((item) => Object.values(item).filter((x) => !x).length == 0)) {
            NotificationManager.warning('Vui lòng điền đầy đủ các trường!', 'Thông báo');
            setLoading(false);
            return;
        }

        const dataBody = {
            data: JSON.stringify(dataForm),
            time: `${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
            created_at: new Date().valueOf(),
            updated_at: new Date().valueOf(),
            deleted_at: ''
        };
        const moneyRef = collection(firestore, FIRESTORE.MONEY);
        setDoc(doc(moneyRef, `${new Date().getMonth() + 1}-${new Date().getFullYear()}`), dataBody)
            .then((response) => {
                console.log(response);
                NotificationManager.success('Tạo mới thành công!', 'Thông báo');
                navigate('/money');
            })
            .catch((err) => {
                console.log(err);
                NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '80%' }
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h2" component="h2" sx={{ paddingBottom: 5 }}>
                Chỉnh sửa quản lí thu chi tháng 4
            </Typography>
            {dataForm?.map((item, index) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& .MuiTextField-root': { marginRight: 2, paddingBottom: 2, width: '100%' }
                    }}
                >
                    <TextField
                        required
                        id="outlined-basic"
                        label="Mục"
                        variant="outlined"
                        value={item.name}
                        onChange={(e) => handleChangeInput(item.id, 'name', e.target.value)}
                    />
                    <TextField
                        required
                        id="outlined-basic"
                        label="Số lượng"
                        variant="outlined"
                        value={item.qty}
                        type="number"
                        onChange={(e) => handleChangeInput(item.id, 'qty', e.target.value)}
                    />
                    <TextField
                        value={item.unit}
                        onChange={(e) => handleChangeInput(item.id, 'unit', e.target.value)}
                        required
                        id="outlined-basic"
                        label="Đơn giá"
                        variant="outlined"
                        type="number"
                    />
                    <TextField
                        value={(item.price || '0')?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                        required
                        id="outlined-basic"
                        label="Tiền"
                        variant="outlined"
                        disabled
                    />
                    <RemoveCircleIcon onClick={() => handleRemoveCategory(item.id)} color="secondary" sx={{ mb: 0, cursor: 'pointer' }} />
                </Box>
            ))}
            {!!dataForm?.length && (
                <Button
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="outlined"
                    sx={{ textAlign: 'center', width: '130px !important', mb: 2, mt: 2, marginLeft: 'auto' }}
                >
                    Chỉnh sửa
                </Button>
            )}
            <Button
                onClick={handleAddItem}
                color="secondary"
                variant="contained"
                endIcon={<AddIcon />}
                sx={{ width: '130px !important', mb: 2, mt: 2 }}
            >
                Thêm mục
            </Button>
            <Button
                onClick={() => navigate('/money')}
                color="secondary"
                variant="contained"
                sx={{ width: '250px !important', mb: 2, mt: 2 }}
            >
                Quay về màn danh sách
            </Button>
        </Box>
    );
}
