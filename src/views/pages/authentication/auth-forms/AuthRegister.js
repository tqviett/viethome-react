import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, ggProvider } from '../../../../firebase';
import { useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { FIRESTORE } from '../../../../constants';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const registerUser = async (body) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, body?.email, body?.password);
            const user = userCredential.user;

            const userData = {
                id: user.uid,
                email: user.email,
                password: body.password,
                name: `${body.fname} ${body.lname}`,
                avatar: '',
                phone: '',
                about: '',
                role: 'user',
                status: 'pending',
                favorites: []
            };

            await setDoc(doc(firestore, FIRESTORE.USERS, user.uid), userData);
            await setDoc(doc(firestore, 'userChats', user.uid), {});

            NotificationManager.success('Đăng kí thành công rồi he!', 'Thông báo');
            navigate('/login');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            NotificationManager.error('Email này đã tồn tại mất rồi!', 'Thông báo');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, ggProvider);
            const user = result.user;

            const querySnapshot = await getDocs(collection(firestore, 'users'));
            const existingUser = querySnapshot.docs.find((doc) => doc.data().email === user.email);

            if (existingUser) {
                navigate('/login');
            } else {
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

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
                        <Typography variant="subtitle1">Đăng ký bằng Email</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    fname: '',
                    lname: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Email không hợp lệ').max(255).required('Vui lòng nhập email!'),
                    password: Yup.string().max(255).required('Vui lòng nhập mật khẩu!')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        registerUser(values);
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
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ"
                                    margin="normal"
                                    name="fname"
                                    type="text"
                                    value={values.fname}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tên"
                                    margin="normal"
                                    name="lname"
                                    type="text"
                                    value={values.lname}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Địa chỉ email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
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
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
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
                                    Đăng ký
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
