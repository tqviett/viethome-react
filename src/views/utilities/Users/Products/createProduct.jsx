import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Container,
    Stack,
    Typography,
    Button,
    IconButton,
    Box,
    TextField,
    Autocomplete,
    ImageList,
    ImageListItem,
    Dialog
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage, firestore } from '../../../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../../../../constants';
import { useNavigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import products from '_mock/products';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { styled, useTheme } from '@mui/material/styles';

import { districtApi, wardApi } from 'api/clients/provinceService';
const listType = [
    { value: 'phongTro', label: 'Phòng trọ' },
    { value: 'nhaTro', label: 'Nhà trọ' },
    { value: 'chungCuMini', label: 'Chung cư mini' }
];
//const listType = ['Phòng trọ', 'Nhà trọ', 'Chung cư mini'];
const INIT_DATA = {
    name: '',
    price: '',
    area: '',
    total: '',
    type: '',
    note: '',
    favorite: 'false',
    status: 'Pending',
    category: [],
    description: '',
    images: [],
    emailUser: ''
};
const StyledProductImg = styled('img')({
    top: 0,
    width: 80,
    height: 80,
    objectFit: 'cover',
    position: 'absolute'
});

const CreateProduct = () => {
    const [dataForm, setDataForm] = useState(INIT_DATA);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [district, setDistrict] = useState([]);
    const [districtIds, setDistrictIds] = useState();
    const [ward, setWard] = useState([]);

    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const email = userInfo?.email;

    useEffect(() => {
        const fetchPublicDistrict = async () => {
            const response = await districtApi();
            if (response.status === 200) {
                const dataDistrict = response.data;
                const districts = dataDistrict.results.map((district) => ({
                    id: district.district_id,
                    name: district.district_name
                }));
                setDistrict(districts);
            }
        };
        fetchPublicDistrict();
    }, []);
    useEffect(() => {
        const fetchPublicWard = async () => {
            const response = await wardApi(districtIds);
            if (response.status === 200) {
                const dataWard = response.data;
                const wards = dataWard.results.map((ward) => ({
                    id: ward.ward_id,
                    name: ward.ward_name
                }));
                setWard(wards);
            }
        };
        ward && fetchPublicWard(districtIds);
    }, [districtIds]);

    const handleChangeInput = (key, value) => {
        const newData = { ...dataForm };
        if (key?.includes('category')) {
            const newCategory = [...dataForm.category];
            if (key[1] === 'district') {
                // Lưu chỉ tên quận/huyện vào category
                newCategory[key[2]][key[1]] = value.name;
            } else {
                // Lưu bình thường cho ward và location
                newCategory[key[2]][key[1]] = value;
            }
            newData.category = newCategory;
        } else newData[key] = value;
        if (key[1] === 'district') {
            if (value && value.id) {
                setDistrictIds(value.id);
            }
        }
        setDataForm(newData);
    };

    const handleAddCategory = () =>
        setDataForm({
            ...dataForm,
            category: [...dataForm.category, { id: new Date().getTime(), district: '', ward: '', user_id: '' }]
        });
    const handleRemoveCategory = (id) => {
        const newList = [...dataForm.category].filter((item) => item.id !== id);
        setDataForm({ ...dataForm, category: newList });
    };

    const handleChangeImages = (e) => {
        const newImages = Array.from(e.target.files);
        setDataForm({ ...dataForm, images: [...dataForm.images, ...newImages] });
    };
    const handleRemoveImage = (index) => {
        const updatedImages = [...dataForm.images];
        updatedImages.splice(index, 1);
        setDataForm({ ...dataForm, images: updatedImages });
    };
    const handleRemoveAllImages = () => {
        setDataForm({ ...dataForm, images: [] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (
            !dataForm.name ||
            !dataForm.total ||
            !dataForm.price ||
            !dataForm.area ||
            !dataForm.note ||
            !dataForm.description ||
            !dataForm.category.every((category) => category.district && category.ward && category.location)
        ) {
            // Thông báo lỗi
            NotificationManager.warning('Vui lòng điền đầy đủ các trường!', 'Thông báo');
            setLoading(false);
            return;
        }

        // Upload các ảnh lên Storage và lấy các đường dẫn download URL
        const uploadTasks = dataForm.images.map((image) => {
            const storageRef = ref(storage, `files/${image.name}`);
            return uploadBytesResumable(storageRef, image);
        });

        try {
            const uploadSnapshots = await Promise.all(uploadTasks);
            const downloadURLs = await Promise.all(uploadSnapshots.map((snapshot) => getDownloadURL(snapshot.ref)));

            // Tạo dữ liệu sản phẩm với các đường dẫn download URL của ảnh
            const dataBody = {
                ...dataForm,
                emailUser: email,
                images: downloadURLs,
                category: JSON.stringify(dataForm.category),
                created_at: new Date().valueOf(),
                updated_at: new Date().valueOf(),
                deleted_at: ''
            };

            // Thêm dữ liệu sản phẩm vào Firestore
            await addDoc(collection(firestore, FIRESTORE.PRODUCTS), dataBody);

            // Đặt lại form và thông báo thành công
            setDataForm(INIT_DATA);
            NotificationManager.success('Tạo mới sản phẩm thành công!', 'Thông báo');
            navigate('/user/my-products');
        } catch (error) {
            console.log(error);
            NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
        } finally {
            setLoading(false);
        }
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
                        sx={{
                            display: 'flex'
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                width: 300,
                                height: 150,
                                boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                                borderRadius: 1,
                                mb: 2
                            }}
                        >
                            <IconButton color="secondary" aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" onChange={handleChangeImages} multiple />
                                <PhotoCamera sx={{ fontSize: 42 }} />
                            </IconButton>
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                width: 300,
                                height: 'auto'
                            }}
                        >
                            {dataForm.images.length > 0 && (
                                <Box sx={{ width: '100%' }}>
                                    <ImageList cols={3} rowHeight={100} sx={{ overflowY: 'auto' }}>
                                        {dataForm.images.map((image, index) => (
                                            <Box key={index} sx={{ position: 'relative' }}>
                                                <ImageListItem>
                                                    <StyledProductImg src={URL.createObjectURL(image)} alt={`product-img-${index}`} />
                                                </ImageListItem>
                                                <IconButton
                                                    sx={{ position: 'absolute', top: 2, right: 2 }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </ImageList>
                                    <Button
                                        sx={{ mt: 1, fontSize: 10 }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleRemoveAllImages}
                                    >
                                        Remove All
                                    </Button>
                                </Box>
                            )}
                        </Stack>
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
                                label="Số lượng có"
                                type="number"
                                value={dataForm.total}
                                onChange={(e) => handleChangeInput('total', e.target.value)}
                            />
                            <Autocomplete
                                id="type2"
                                options={listType}
                                value={dataForm.type}
                                onChange={(e, value) => handleChangeInput('type', value)}
                                renderInput={(params) => <TextField {...params} label="Loại:" placeholder="Phân loại" />}
                            />
                            <TextField
                                required
                                id="price"
                                label="Giá sản phẩm"
                                type="number"
                                value={dataForm.price}
                                onChange={(e) => handleChangeInput('price', e.target.value)}
                                helperText={`${(dataForm.price || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} VNĐ/Tháng`}
                            />
                            <TextField
                                required
                                id="area"
                                value={dataForm.area}
                                onChange={(e) => handleChangeInput('area', e.target.value)}
                                label="Diện tích"
                                type="number"
                                helperText={`${(dataForm.area || 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} m²`}
                            />

                            <TextField
                                required
                                id="note"
                                label="Ghi chú"
                                multiline
                                rows={5}
                                value={dataForm.note}
                                onChange={(e) => handleChangeInput('note', e.target.value)}
                            />
                            {(dataForm.category || [])?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '300px 300px auto',
                                        alignItems: 'center',
                                        mb: 2,
                                        flexWrap: 'wrap',
                                        gridRowGap: '16px', // Thêm khoảng cách 16px giữa các hàng
                                        gap: '16px', // Thêm khoảng cách 16px giữa các phần tử
                                        '& .MuiTextField-root': {
                                            mb: 0,
                                            '&:nth-of-type(3)': {
                                                gridColumn: 'span 2'
                                            },
                                            '&:nth-of-type(4)': {
                                                display: 'flex'
                                            }
                                        }
                                    }}
                                >
                                    <Autocomplete
                                        id="district"
                                        size="small"
                                        options={district}
                                        getOptionLabel={(option) => (option ? option.name : '')}
                                        onChange={(e, value) => handleChangeInput(['category', 'district', index], value)}
                                        renderInput={(params) => <TextField {...params} label="Quận/Huyện:" />}
                                    />

                                    <Autocomplete
                                        id="ward"
                                        size="small"
                                        options={ward}
                                        getOptionLabel={(option) => (option ? option.name : '')}
                                        onChange={(e, value) => handleChangeInput(['category', 'ward', index], value.name)}
                                        renderInput={(params) => <TextField {...params} label="Phường/Xã/Thị xã:" />}
                                    />
                                    <TextField
                                        label="Chi tiết:"
                                        id="location"
                                        value={item.location || ''} // Ensure a default value if item.location is undefined or null
                                        size="small"
                                        onChange={(e) => handleChangeInput(['category', 'location', index], e.target.value)}
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
                                Thêm địa chỉ
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
