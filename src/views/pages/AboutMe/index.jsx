import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Typography, Grid, CardContent, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router-dom';
import Illustration_404 from 'ui-component/illustration_404';
import Logo from 'ui-component/Logo';

export default function AboutMe() {
    return (
        <>
            <Helmet>
                <title> ABOUT-ME </title>
            </Helmet>
            <Container>
                <Typography gutterBottom textAlign={'center'}>
                    <Logo />
                </Typography>
                <Box
                    sx={{
                        py: 5,
                        maxWidth: '100%',
                        mx: 'auto',
                        display: 'flex',
                        height: '80vh',
                        flexDirection: 'column'
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item sx={{ width: '100%' }}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        VỀ VIET-HOME
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        VIỆT-HOME (<a href="https://viethome-web.web.app">https://viethome-web.web.app</a>) là nền tảng cung
                                        cấp các dịch vụ lĩnh vực bất động sản được ra mắt vào đầu năm 2024. Việt-Home là một nền tảng Hiệu
                                        quả & Đáng tin cậy dành cho Người bán/ Người cho thuê bất động sản.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sx={{ width: '100%' }}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        SỨ MỆNH CỦA VIET-HOME
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Với sứ mệnh xây dựng một hệ sinh thái về bất động sản toàn diện, cũng như trở thành cố vấn cho những
                                        người tìm kiếm bất động sản, Việt-Home được thành lập với định hướng phát triển thành “Nền tảng về
                                        bất động sản trực tuyến hàng đầu Việt Nam”, góp phần kết nối thị trường bất động sản trên cả nước và
                                        giúp Người mua/ Người thuê tìm kiếm được sản phẩm bất động sản phù hợp nhất.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sx={{ width: '100%' }}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        THÔNG TIN LIÊN HỆ
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        VIET-HOME
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Địa chỉ: số 55 Giải Phóng, phường Đồng Tâm, quận Hai Bà Trưng, tp.Hà Nội, Việt Nam
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: taquocviet262@gmail.com
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
