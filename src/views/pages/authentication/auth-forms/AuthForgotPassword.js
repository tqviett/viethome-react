import React from 'react';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';

const FirebaseForgotPassword = () => {
    const navigate = useNavigate();

    const forgotPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            NotificationManager.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!', 'Thành công');
            navigate('/login');
        } catch (error) {
            console.error(error.code, error.message);
            NotificationManager.error(error.message || 'Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu!', 'Lỗi');
        }
    };

    return (
        <Grid container direction="column" justifyContent="center" spacing={2}>
            <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box mb={2}>
                    <Typography variant="h2">Nhập địa chỉ email của bạn</Typography>
                </Box>
            </Grid>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email!')
                })}
                onSubmit={async (values, { setErrors }) => {
                    try {
                        await forgotPassword(values.email);
                    } catch (err) {
                        console.error(err);
                        setErrors({ submit: err.message });
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-email">Địa chỉ Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type="email"
                                value={values.email}
                                onBlur={handleBlur('email')}
                                onChange={handleChange('email')}
                                label="Email"
                            />
                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        </FormControl>
                        <Box mt={2}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Gửi yêu cầu
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Grid>
    );
};

export default FirebaseForgotPassword;
