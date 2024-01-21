import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button, IconButton, Box, TextField, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage, firestore } from '../../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

const listType = ['DYI', 'Thành phẩm', 'Hoa', 'Thú', 'Gương', 'Khác'];
const INIT_DATA = {
    name: '',
    price: '',
    total: '',
    sold: '',
    type: [],
    note: '',
    category: [],
    description: '',
    image: ''
};

const CreateProduct = () => {
    const [dataForm, setDataForm] = useState(INIT_DATA);
    const [loading, setLoading] = useState(false);
    const handleAddCategory = () =>
        setDataForm({
            ...dataForm,
            category: [...dataForm.category, { id: new Date().getTime(), category: '', color: '', total: 0, sold: 0 }]
        });
    const handleRemoveCategory = (id) => {
        const newList = [...dataForm.category].filter((item) => item.id !== id);
        setDataForm({ ...dataForm, category: newList });
    };
    const navigate = useNavigate();

    const handleChangeInput = (key, value) => {
        const newData = { ...dataForm };
        if (key?.includes('category')) {
            const newCategory = [...dataForm.category];
            newCategory[key[2]][key[1]] = value;
            newData.category = newCategory;
        } else newData[key] = value;
        setDataForm(newData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const { image, ...rest } = dataForm;
        if (Object.values(rest).filter((x) => !x || !x.length).length > 0 || !image) {
            NotificationManager.warning('Vui lòng điền đầy đủ các trường!', 'Thông báo');
            setLoading(false);
            return;
        }

        const storageRef = ref(storage, `files/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress);
            },
            (error) => {
                console.log(error);
                NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const dataBody = {
                        ...dataForm,
                        image: downloadURL,
                        type: JSON.stringify(dataForm.type),
                        category: JSON.stringify(dataForm.category),
                        created_at: new Date().valueOf(),
                        updated_at: new Date().valueOf(),
                        deleted_at: ''
                    };
                    addDoc(collection(firestore, FIRESTORE.PRODUCTS), dataBody)
                        .then((response) => {
                            console.log(response);
                            setDataForm(INIT_DATA);
                            NotificationManager.success('Tạo mới sản phẩm thành công!', 'Thông báo');
                            navigate('/products');
                        })
                        .catch((err) => {
                            console.log(err);
                            NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
                        });
                });
            }
        );
        setLoading(false);
    };

    return (
        <>
            <Helmet>
                <title> Dashboard: Create Product | KHEO-DYN </title>
            </Helmet>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Tạo mới sản phẩm
                </Typography>
                <Stack
                    sx={{
                        border: '1px solid #ffff',
                        p: 3,
                        backgroundColor: '#ffff',
                        borderRadius: 1,
                        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                    }}
                    direction="row"
                    flexWrap="wrap-reverse"
                    alignItems="flex-end"
                    justifyContent="space-between"
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            width: 300,
                            height: 300,
                            boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                            borderRadius: 1
                        }}
                    >
                        {!dataForm.image ? (
                            <IconButton color="secondary" aria-label="upload picture" component="label">
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleChangeInput('image', e.target.files[0])}
                                />
                                <PhotoCamera sx={{ fontSize: 42 }} />
                            </IconButton>
                        ) : (
                            <img alt="product-img" style={{ maxWidth: 300 }} height={300} src={URL.createObjectURL(dataForm.image)} />
                        )}
                    </Stack>
                    <Stack
                        sx={{
                            width: '65%'
                        }}
                    >
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { mb: 4, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                required
                                id="name"
                                label="Tên sản phẩm"
                                value={dataForm.name}
                                onChange={(e) => handleChangeInput('name', e.target.value)}
                            />
                            <TextField
                                required
                                id="quantity"
                                label="Số lượng"
                                type="number"
                                value={dataForm.total}
                                onChange={(e) => handleChangeInput('total', e.target.value)}
                            />
                            <TextField
                                required
                                id="quantity"
                                value={dataForm.sold}
                                onChange={(e) => handleChangeInput('sold', e.target.value)}
                                label="Số lượng sản phầm đã bán"
                                type="number"
                            />
                            <TextField
                                required
                                id="price"
                                label="Giá sản phẩm"
                                type="number"
                                defaultValue={299000}
                                value={dataForm.price}
                                onChange={(e) => handleChangeInput('price', e.target.value)}
                                helperText={`${(dataForm.price || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} VNĐ`}
                            />
                            <Autocomplete
                                multiple
                                id="type2"
                                options={listType}
                                value={dataForm.type}
                                onChange={(e, value) => handleChangeInput('type', value)}
                                renderInput={(params) => <TextField {...params} label="Loại sản phẩm" placeholder="Phân loại" />}
                            />
                            <TextField
                                id="note"
                                label="Ghi chú"
                                multiline
                                rows={5}
                                value={dataForm.note}
                                onChange={(e) => handleChangeInput('note', e.target.value)}
                            />
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Phân loại sản phẩm
                            </Typography>
                            {(dataForm.category || [])?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        alignItems: 'center',
                                        mb: 2,
                                        '& .MuiTextField-root': {
                                            mb: 0,
                                            '&:nth-child(3)': {
                                                width: 180
                                            },
                                            '&:nth-child(1)': {
                                                width: 240
                                            },
                                            '&:nth-child(4)': {
                                                width: 180
                                            }
                                        }
                                    }}
                                >
                                    <TextField
                                        label="Loại"
                                        id="category-type"
                                        value={item.type}
                                        size="small"
                                        onChange={(e) => handleChangeInput(['category', 'type', index], e.target.value)}
                                    />
                                    <Autocomplete
                                        id="type"
                                        sx={{ width: 300 }}
                                        size="small"
                                        options={listType}
                                        value={item.category}
                                        onChange={(e, value) => handleChangeInput(['category', 'category', index], value)}
                                        renderInput={(params) => <TextField {...params} label="Loại sản phẩm" placeholder="Phân loại" />}
                                    />
                                    <TextField
                                        label="Số lượng"
                                        id="category-number"
                                        type="number"
                                        onChange={(e) => handleChangeInput(['category', 'total', index], e.target.value)}
                                        value={item.total}
                                        size="small"
                                    />
                                    <TextField
                                        label="Đã bán"
                                        id="category-number"
                                        type="number"
                                        onChange={(e) => handleChangeInput(['category', 'sold', index], e.target.value)}
                                        value={item.sold}
                                        size="small"
                                    />
                                    <RemoveCircleIcon
                                        onClick={() => handleRemoveCategory(item.id)}
                                        color="secondary"
                                        sx={{ mb: 0, cursor: 'pointer' }}
                                    />
                                </Box>
                            ))}
                            <Button
                                onClick={handleAddCategory}
                                color="secondary"
                                sx={{ mb: 4 }}
                                variant="contained"
                                endIcon={<AddCircleIcon />}
                            >
                                Thêm loại
                            </Button>

                            <CKEditor
                                editor={ClassicEditor}
                                data={dataForm.description}
                                onReady={(editor) => {
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    handleChangeInput('description', data);
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                        </Box>
                        <Button
                            color="secondary"
                            disabled={loading}
                            onClick={handleSubmit}
                            variant="contained"
                            endIcon={<AddIcon />}
                            sx={{ width: 200, marginLeft: 'auto', mt: 3 }}
                        >
                            Thêm mới sản phẩm
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default CreateProduct;
