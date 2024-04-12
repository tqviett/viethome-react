import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Avatar,
    Container,
    Stack,
    Typography,
    Button,
    Box,
    TextField,
    Autocomplete,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Divider,
    FormControl
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage, firestore } from '../../../../firebase';
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { FIRESTORE } from '../../../../constants';
import { useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';

const userData = {
    id: '',
    email: '',
    password: '',
    name: '',
    avatar: '',
    phone: '',
    about: '',
    role: '',
    message: []
};

export default function Page() {
    const [dataForm, setDataForm] = useState(userData);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    //get user in local storage
    const user = localStorage.getItem('user');
    const userInfo = user ? JSON.parse(user) : null;
    const emailLocal = userInfo?.email;

    useEffect(() => {
        if (emailLocal) {
            findUser();
        }
    }, [emailLocal]);

    //find user with emailLocal
    const findUser = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('email', '==', emailLocal));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const dataProduct = doc.data();
                setDataForm({
                    ...dataProduct,
                    avatar: '',
                    imageUrl: dataProduct.avatar
                });
            });
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };

    const handleChangeInput = (field, value) => {
        setDataForm({
            ...dataForm,
            [field]: value
        });
    };

    //change Avatar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageFile(file);
                setImageUrl(reader.result);
                try {
                    const storageRef = ref(storage, `avatars/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    await uploadTask;
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    if (downloadURL) {
                        setDataForm({ ...dataForm, avatar: downloadURL });
                    } else {
                        console.error('Error: downloadURL is undefined');
                    }
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
        const { avatar, imageUrl, ...rest } = dataForm;

        try {
            let downloadURL = imageUrl;

            if (imageFile) {
                const storageRef = ref(storage, `avatars/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
                await uploadTask;
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            }

            const userQuery = query(collection(firestore, 'users'), where('email', '==', emailLocal));
            const querySnapshot = await getDocs(userQuery);

            querySnapshot.forEach(async (doc) => {
                const userDocRef = doc.ref;
                const dataBody = {
                    ...rest,
                    avatar: downloadURL
                };
                await updateDoc(userDocRef, dataBody);
            });

            NotificationManager.success('Cập nhật thông tin thành công!', 'Thông báo');

            navigate('/profile');

            setTimeout(() => {
                //reload ~profile
                NotificationManager.success('Thông tin sẽ cập nhật lại ngay', 'Thông báo');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }, 800);
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
                <title> TRANG CÁ NHÂN | VIET-HOME </title>
            </Helmet>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}></Typography>
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
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: 300,
                            display: 'flex',
                            position: 'relative'
                        }}
                    >
                        <IconButton
                            color="secondary"
                            aria-label="upload picture"
                            component="label"
                            sx={{
                                position: 'absolute',
                                top: 100,
                                right: 120,
                                zIndex: 1,
                                background: 'rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            <input hidden accept="image/*" type="file" onChange={handleImageChange} multiple />
                            <PhotoCamera sx={{ fontSize: 40 }} />
                        </IconButton>

                        <CardContent>
                            <Stack spacing={2} sx={{ width: 300, alignItems: 'center' }}>
                                <Avatar
                                    src={imageUrl || dataForm.imageUrl}
                                    sx={{
                                        height: '180px',
                                        width: '180px',
                                        cursor: 'pointer',
                                        borderRadius: '100%',
                                        border: '8px solid #ccc'
                                    }}
                                />
                            </Stack>
                        </CardContent>
                    </Stack>

                    <Stack
                        sx={{
                            width: '65%'
                        }}
                    >
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': {
                                    marginBottom: 0,
                                    gridColumn: 'span 2',
                                    '&:nth-of-type(2), &:nth-of-type(3)': {
                                        gridColumn: 'span 1'
                                    },
                                    '&:nth-of-type(4)': {
                                        gridColumn: 'span 2'
                                    }
                                },
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gridTemplateRows: 'auto auto auto',
                                gridRowGap: '16px',
                                gap: '16px'
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField required id="email" label="Email (không thể thay đổi)" value={dataForm.email} />
                            <TextField
                                required
                                id="name"
                                label="Họ tên"
                                value={dataForm.name}
                                onChange={(e) => handleChangeInput('name', e.target.value)}
                            />
                            <TextField
                                required
                                id="phone"
                                label="Số điện thoại"
                                value={dataForm.phone}
                                onChange={(e) => handleChangeInput('phone', e.target.value)}
                            />
                            <TextField
                                required
                                multiline
                                rows={5}
                                id="about"
                                label="mô tả"
                                value={dataForm.about}
                                onChange={(e) => handleChangeInput('about', e.target.value)}
                            />
                        </Box>
                        <Button
                            color="secondary"
                            disabled={loading}
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{ width: 100, marginLeft: 'auto', mt: 3 }}
                        >
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
