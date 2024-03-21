import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Container,
    Stack,
    Typography,
    Button,
    Box,
    TextField,
    Autocomplete,
    Dialog,
    DialogTitle,
    IconButton,
    ImageList,
    ImageListItem
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage, firestore } from '../../../../firebase';
import { doc, updateDoc, getDoc, deleteDoc, collection } from 'firebase/firestore';
import { FIRESTORE } from '../../../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Delete, Edit } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

//API functions
import { districtApi, wardApi } from 'api/clients/provinceService';

const listType = ['Phòng trọ', 'Nhà trọ', 'Chung cư mini'];
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
    images: []
};
const StyledProductImg = styled('img')({
    top: 0,
    width: 80,
    height: 80,
    objectFit: 'cover',
    position: 'absolute'
});
const EditProduct = () => {
    const [dataForm, setDataForm] = useState(INIT_DATA);
    const [dataEditor, setDataEditor] = useState('');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [district, setDistrict] = useState([]);
    const [districtIds, setDistrictIds] = useState();
    const [ward, setWard] = useState([]);

    // USEEFFECT
    useEffect(() => {
        if (params?.id) findProduct();
    }, [params]);
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
    }, [districtIds]);

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
        districtIds && fetchPublicWard(districtIds);
    }, [districtIds]);

    //Function

    const handleChangeInput = (key, value) => {
        const newData = { ...dataForm };
        if (key?.includes('category')) {
            const newCategory = [...dataForm.category];
            if (key[1] === 'district') {
                // Lưu chỉ tên quận/huyện vào category
                newCategory[key[2]][key[1]] = value ? value.name : ''; // Lưu giá trị name của tùy chọn
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
    const findProduct = async () => {
        const snap = await getDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id));
        if (snap.exists()) {
            const dataProduct = snap.data();
            setDataEditor(dataProduct.description);
            setDataForm({
                ...dataProduct,
                images: dataProduct.images,
                id: params.id,
                category: JSON.parse(dataProduct.category)
            });
        } else {
            console.log('No such document');
        }
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

    const navigate = useNavigate();

    const handleRemoveImage = (index) => {
        const updatedImages = [...dataForm.images];
        updatedImages.splice(index, 1);
        setDataForm({ ...dataForm, images: updatedImages });
    };

    const handleRemoveAllImages = () => {
        setDataForm({ ...dataForm, images: [] });
    };
    const handleChangeImages = (e) => {
        const newImages = Array.from(e.target.files);
        setDataForm({ ...dataForm, images: [...dataForm.images, ...newImages] });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const uploadTasks = dataForm.images
            .filter((image) => image instanceof File)
            .map((image) => {
                const storageRef = ref(storage, `files/${image.name}`);
                return uploadBytesResumable(storageRef, image);
            });

        try {
            const uploadSnapshots = await Promise.all(uploadTasks);
            const downloadURLs = await Promise.all(uploadSnapshots.map((snapshot) => getDownloadURL(snapshot.ref)));
            const updatedImages = [...dataForm.images.filter((image) => typeof image === 'string'), ...downloadURLs];

            const dataBody = {
                ...dataForm,
                images: updatedImages,
                category: JSON.stringify(dataForm.category),
                updated_at: new Date().valueOf(),
                deleted_at: ''
            };

            await updateDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id), dataBody);
            NotificationManager.success('Cập nhật sản phẩm thành công!', 'Thông báo');
            setDataForm(INIT_DATA);
            navigate('/user/my-products');
        } catch (error) {
            console.log(error);
            NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
        } finally {
            setLoading(false);
        }
    };

    // const handleChangeImages = async (e, setDataForm, dataForm) => {
    //     const files = e.target.files;
    //     if (files) {
    //         const newImages = [];
    //         const uploadTasks = Array.from(files).map((file) => {
    //             return new Promise((resolve, reject) => {
    //                 const reader = new FileReader();
    //                 reader.onloadend = async () => {
    //                     try {
    //                         const storageRef = ref(storage, `files/${file.name}`);
    //                         const uploadTask = uploadBytesResumable(storageRef, file);
    //                         await uploadTask;
    //                         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //                         newImages.push(downloadURL);
    //                         resolve();
    //                     } catch (error) {
    //                         reject(error);
    //                     }
    //                 };
    //                 reader.readAsDataURL(file);
    //             });
    //         });
    //         await Promise.all(uploadTasks);
    //         if (dataForm) {
    //             setDataForm({ ...dataForm, images: [...dataForm.images, ...newImages] });
    //         } else {
    //             setDataForm({ ...dataForm, images: [...newImages] });
    //         }
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const dataBody = {
    //             ...dataForm,
    //             category: JSON.stringify(dataForm.category),
    //             updated_at: new Date().valueOf(),
    //             deleted_at: ''
    //         };
    //         await updateDoc(doc(firestore, FIRESTORE.PRODUCTS, dataForm.id), dataBody);
    //         setDataForm(INIT_DATA);
    //         NotificationManager.success('Chỉnh sửa sản phẩm thành công!', 'Thông báo');
    //         navigate('/my-products');
    //     } catch (error) {
    //         console.error(error);
    //         NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleDeleteProduct = async () => {
        try {
            await deleteDoc(doc(firestore, FIRESTORE.PRODUCTS, params.id));
            NotificationManager.success('Xóa sản phẩm thành công!', 'Thông báo');
            navigate('/user/my-products');
        } catch (error) {
            console.error(error);
            NotificationManager.error('Có lỗi xảy ra!', 'Thông báo');
        }
    };

    const ModalConfirm = () => (
        <Dialog onClose={() => setOpenModal(false)} open={openModal} sx={{ padding: '30px !important' }}>
            <IconButton size="large" aria-label="delete" color="error" sx={{ paddingTop: 2 }}>
                <DeleteIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <DialogTitle sx={{ fontSize: 18 }}>Bạn muốn xóa sản phẩm này à?</DialogTitle>
            <Stack spacing={2} paddingBottom={2} paddingTop={2} paddingRight={2} direction="row" justifyContent={'flex-end'}>
                <Button color="error" variant="contained" onClick={handleDeleteProduct}>
                    Xóa luôn
                </Button>
                <Button color="error" variant="outlined" onClick={() => setOpenModal(false)}>
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
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleChangeImages(e, setDataForm, dataForm)}
                                    multiple
                                />
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
                                                    {image instanceof File ? (
                                                        <StyledProductImg src={URL.createObjectURL(image)} alt={`product-img-${index}`} />
                                                    ) : (
                                                        <StyledProductImg src={image} alt={`product-img-${index}`} />
                                                    )}
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
                                        value={item.district || ''}
                                        getOptionLabel={(option) => option?.name || item.district} // Sử dụng thuộc tính name để hiển thị
                                        onChange={(e, value) => handleChangeInput(['category', 'district', index], value)}
                                        renderInput={(params) => <TextField {...params} label="Quận/Huyện:" />}
                                    />

                                    <Autocomplete
                                        id="ward"
                                        size="small"
                                        options={ward}
                                        value={item.ward || ''}
                                        getOptionLabel={(option) => option?.name || item.ward} // Chỉ trả về thuộc tính "name"
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