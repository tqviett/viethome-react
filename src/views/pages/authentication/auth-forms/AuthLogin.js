import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

import Google from 'assets/images/icons/social-google.svg';
import { auth, ggProvider } from '../../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();

    const googleHandler = async () => {
        console.error('Login');
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, ggProvider);
            const user = result.user;

            // Check if the user's email already exists in Firestore
            const querySnapshot = await getDocs(collection(firestore, 'users'));
            const existingUser = querySnapshot.docs.find((doc) => doc.data().email === user.email);

            if (existingUser) {
                // If email already exists, save necessary user info to localStorage and navigate to home
                const userInfo = {
                    role: existingUser.data().role,
                    email: existingUser.data().email,
                    name: existingUser.data().name
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
                navigate('/');
            } else {
                // If email does not exist, create new user data and save to Firestore
                const userData = {
                    id: user.uid,
                    email: user.email,
                    password: '123456',
                    name: user.displayName || '',
                    avatar: user.photoURL || '',
                    phone: '',
                    about: '',
                    role: 'user',
                    status: 'pending'
                };
                await setDoc(doc(firestore, 'users', user.uid), userData);
                await setDoc(doc(firestore, 'userChats', user.uid), {});

                // Save necessary user info to localStorage and navigate to home
                const userInfo = {
                    role: 'user',
                    email: user.email,
                    name: user.displayName || ''
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
                navigate('/');
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const loginUser = async (body) => {
        signInWithEmailAndPassword(auth, body?.email, body?.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // Lấy thông tin về người dùng từ Firestore
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, where('email', '==', user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // Kiểm tra vai trò của người dùng và lưu vào localStorage
                    const userData = doc.data();
                    const role = userData.role;
                    const name = userData.name;
                    const status = userData.status;
                    const userInfo = {
                        ...user.providerData,
                        role: role,
                        email: user.email,
                        name: name
                    };
                    if (status === 'banned') {
                        NotificationManager.error('Tài khoản này bị cấm do vi phạm các Điều khoản sử dụng!', 'Thông báo');
                        navigate('/login'); // Chuyển hướng người dùng về trang đăng nhập
                    } else {
                        localStorage.setItem('user', JSON.stringify(userInfo));
                        navigate(role === 'admin' ? '/admin/dashboard' : '/');
                    }
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                NotificationManager.error('Tài khoản hoặc mật khẩu của bạn không đúng!', 'Thông báo');
            });
    };
    const user = localStorage.getItem('user');
    const userLocal = user ? JSON.parse(user) : null;
    useEffect(() => {
        if (userLocal !== null) {
            navigate('/');
        }
    }, [userLocal]);
    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={handleGoogleLogin}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.grey[50],
                                borderColor: theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sử dụng tài khoản google
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor: `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${customization.borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            Hoặc
                        </Button>

                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Đăng nhập bằng Email</Typography>
                    </Box>
                </Grid>
            </Grid>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Email không hợp lệ').max(255).required('Vui lòng nhập email!'),
                    password: Yup.string().max(255).required('Vui lòng nhập mật khẩu!')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        loginUser(values);
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Địa chỉ email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Nhớ tài khoản"
                            />
                            <Typography
                                component={Link}
                                to="/forgot-password"
                                variant="subtitle1"
                                color="secondary"
                                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                            >
                                Bạn bị quên mất mật khẩu?
                            </Typography>
                        </Stack>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Đăng nhập
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
