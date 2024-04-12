import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router-dom';
import Illustration_404 from 'ui-component/illustration_404';
import Logo from 'ui-component/Logo';

export default function NotFoundView() {
    return (
        <>
            <Helmet>
                <title> ERROR </title>
            </Helmet>
            <Container>
                <Box
                    sx={{
                        py: 12,
                        maxWidth: '100%',
                        mx: 'auto',
                        display: 'flex',
                        height: '80vh',
                        textAlign: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h3">Xin lỗi, trang không tồn tại!</Typography>

                    <Typography sx={{ color: 'text.secondary', my: 2 }}>
                        {' '}
                        {/* Giảm khoảng cách giữa các phần tử */}
                        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm hoặc có thể trang bạn không được phép truy cập. Hãy
                        kiểm tra lại thông tin đường dẫn
                    </Typography>

                    <Box
                        sx={{
                            mx: 'auto',
                            height: 260
                        }}
                    >
                        <Illustration_404 />
                    </Box>

                    <Button
                        component={Link}
                        to={'/'}
                        size="large"
                        color="secondary"
                        sx={{
                            my: { xs: 5, sm: 15 },
                            border: '2px solid',
                            borderColor: 'secondary.main',
                            borderRadius: '8px'
                        }}
                    >
                        Quay lại Trang chủ
                    </Button>
                </Box>
            </Container>
        </>
    );
}
