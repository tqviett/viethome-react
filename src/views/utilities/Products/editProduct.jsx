import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button, Box, TextField, Autocomplete, Dialog, DialogTitle, IconButton } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage, firestore } from '../../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE } from '../../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Delete, Edit } from '@mui/icons-material';

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

const EditProduct = () => {
    const [dataForm, setDataForm] = useState(INIT_DATA);
    const [dataEditor, setDataEditor] = useState('');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

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

    const findProduct = async () => {
        const snap = await getDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id));
        if (snap.exists()) {
            const dataProduct = snap.data();
            setDataEditor(dataProduct.description);
            setDataForm({
                ...dataProduct,
                image: '',
                imageUrl: dataProduct.image,
                id: params.id,
                category: JSON.parse(dataProduct.category),
                type: JSON.parse(dataProduct.type)
            });
        } else {
            console.log('No such document');
        }
    };

    useEffect(() => {
        if (params?.id) findProduct();
    }, [params]);

    const handleChangeInput = (key, value) => {
        const newData = { ...dataForm };
        if (key?.includes('category')) {
            const newCategory = [...dataForm.category];
            newCategory[key[2]][key[1]] = value;
            newData.category = newCategory;
        } else newData[key] = value;
        setDataForm(newData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageFile(file);
                setImageUrl(reader.result);
                try {
                    const storageRef = ref(storage, `files/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    await uploadTask;
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setDataForm({ ...dataForm, image: downloadURL });
                } catch (error) {
                    console.error('Error uploading image to storage:', error);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { image, ...rest } = dataForm;

        try {
            let downloadURL = dataForm.imageUrl;

            if (imageFile) {
                const storageRef = ref(storage, `files/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                await uploadTask;
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            }

            const dataBody = {
                ...rest,
                image: downloadURL,
                description: dataEditor,
                type: JSON.stringify(dataForm.type),
                category: JSON.stringify(dataForm.category),
                updated_at: new Date().valueOf(),
                deleted_at: ''
            };

            const docRef = doc(firestore, FIRESTORE.PRODUCTS, params.id);
            await updateDoc(docRef, dataBody);

            NotificationManager.success('Chỉnh sửa sản phẩm thành công!', 'Thông báo');
            navigate('/products');
        } catch (error) {
            console.error(error);
            NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
        }

        setLoading(false);
    };

    const ModalConfirm = () => (
        <Dialog onClose={() => setOpenModal(false)} open={openModal} sx={{ padding: '30px !important' }}>
            <IconButton size="large" aria-label="delete" color="error" sx={{ paddingTop: 2 }}>
                <DeleteIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <DialogTitle sx={{ fontSize: 18 }}>Bạn muốn xóa sản phẩm này à?</DialogTitle>
            <Stack spacing={2} paddingBottom={2} paddingTop={2} paddingRight={2} direction="row" justifyContent={'flex-end'}>
                <Button color="error" variant="contained">
                    Xóa luôn
                </Button>
                <Button color="error" variant="outlined">
                    À thôi
                </Button>
            </Stack>
        </Dialog>
    );

    return (
        <>
            <Helmet>
                <title> Dashboard: Edit-product | VIET-HOME </title>
            </Helmet>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Chỉnh sửa sản phẩm
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
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        <img
                            alt="product-img"
                            style={{ maxWidth: 300, cursor: 'pointer' }}
                            height={300}
                            src={imageUrl || dataForm.imageUrl}
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        />
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
                                id="price"
                                label="Giá sản phẩm"
                                type="number"
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
                                data={dataEditor}
                                onReady={(editor) => {
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setDataEditor(data);
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
                            disabled={loading || !params?.id}
                            onClick={handleSubmit}
                            variant="contained"
                            endIcon={<Edit />}
                            sx={{ width: 200, marginLeft: 'auto', mt: 3 }}
                        >
                            Lưu chỉnh sửa
                        </Button>
                        <Button
                            color="secondary"
                            disabled={!params?.id}
                            onClick={() => setOpenModal(true)}
                            variant="outlined"
                            endIcon={<Delete />}
                            sx={{ width: 200, marginLeft: 'auto', mt: 3 }}
                        >
                            Xóa sản phẩm
                        </Button>
                        {ModalConfirm()}
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default EditProduct;
