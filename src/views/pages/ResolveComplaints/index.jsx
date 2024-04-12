import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography, Grid, CardContent, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function ResolveComplaints() {
    return (
        <>
            <Helmet>
                <title> Resolve-Complaints </title>
            </Helmet>
            <Container>
                <Typography gutterBottom textAlign={'center'} variant="h2">
                    GIẢI QUYẾT KHIẾU NẠI
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
                                    <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 550, overflow: 'auto' }}>
                                        <p>
                                            Ban quản trị VIET-HOME (<a href="https://viethome-web.web.app">https://viethome-web.web.app</a>)
                                            sẵn sàng hỗ trợ nhanh nhất và tốt nhất khi nhận được các phản hồi, khiếu nại về việc tin
                                            đăng/quảng cáo của người đăng tin không chuẩn xác, sai sự thật…. bằng việc hỗ trợ xóa tin và
                                            thông tin tới người đăng tin.
                                        </p>
                                        <p>
                                            Khi phát sinh tranh chấp, Ban quản trị VIET-HOME đề cao giải pháp thương lượng, hòa giải giữa
                                            các bên nhằm duy trì sự tin cậy của thành viên vào chất lượng sản phẩm dịch vụ chúng tôi
                                        </p>
                                        <p>
                                            Trường hợp khách hàng gửi thông tin khiếu nại trực tiếp đến Ban quản trị Sàn giao dịch qua
                                            email: taquocviet262@gmail.com, Ban quản trị sẽ email phải hồi lại ý kiến phản ánh của khách
                                            hàng. Thời hạn giải quyết khiếu nại là 07 (bảy) ngày làm việc kể từ ngày nhận được thông tin
                                            khiếu nại trực tiếp của khách hàng.
                                        </p>
                                        <p>Để gửi khiếu nại, thành viên thực hiện theo các bước:</p>
                                        <p>
                                            <b>Bước 1:</b>Thành viên người thuê/thuê khiếu nại về sản phẩm dịch vụ của người đăng tin với:
                                        </p>

                                        <b>VIET-HOME</b>
                                        <p>Địa chỉ: số 55 Giải Phóng, phường Đồng Tâm, quận Hai Bà Trưng, tp.Hà Nội, Việt Nam</p>
                                        <p>Email: taquocviet262@gmail.com</p>
                                        <p>
                                            <b>Bước 2:</b>Bộ phận chăm sóc khách hàng của VIET-HOME sẽ tiếp nhận các khiếu nại của thành
                                            viên người thuê, tùy theo tính chất và mức độ của khiếu nại thì bên Sàn giao dịch
                                            Phongtro123.com sẽ có những biện pháp cụ thể hỗ trợ người thuê để giải quyết tranh chấp đó.
                                        </p>
                                        <p>Quy trình xử lý:</p>
                                        <p>
                                            - Tạm khóa tài khoản, dừng các giao dịch mua bán trên VIET-HOME. ViET-HOME sẽ liên lạc với chủ
                                            tin đăng/công ty qua Email/Điện thoại/...để yêu cầu chủ tin đăng/ công ty bị khiếu nại trả lời
                                            giao dịch bị khiếu nại.
                                        </p>
                                        <p>
                                            - Chủ tin đăng bị khiếu nại sẽ tự liên hệ với thành viên/khách mua hàng và giải quyết thỏa đáng
                                            các khiếu nại đó. Sau khi đã giải quyết xong, chủ tin đăng bị khiếu nại liên lạc với ViET-HOME
                                            để thông báo tình hình. ViET-HOME sẽ liên hệ với thành viên/khách hàng khiếu nại để kiểm tra
                                            thực tế.
                                        </p>
                                        <p>
                                            - Sau 2 ngày ViET-HOME dùng các hình thức liên lạc với chủ tin đăng/công ty mà không có bất kỳ
                                            hành động nào thì ViET-HOME sẽ xóa tài khoản vĩnh viễn, đưa chủ tin đăng/công ty vào Black-list,
                                            thông báo chi tiết thông tin cá nhân của chủ tin đăng trên mục Tin tức của VIET-HOME để các
                                            thành viên và khách hàng biết.
                                        </p>
                                        <p>
                                            <b>Bước 3:</b>Trong trường nằm ngoài khả năng và thẩm quyền của VIET-HOME thì Ban quản trị sẽ đề
                                            nghị người thuê đưa vụ việc này ra cơ quan nhà nước có thẩm quyền giải quyết theo pháp luật.
                                        </p>

                                        <p>
                                            VIET-HOME tôn trọng và nghiêm túc thực hiện các quy định của pháp luật về bảo vệ quyền lợi của
                                            người thuê (người tiêu dùng). Vì vậy, đề nghị các thành viên đăng tin rao bất động sản, dịch vụ
                                            trên sàn cung cấp đầy đủ, chính xác, trung thực và chi tiết các thông tin liên quan đến sản
                                            phẩm, dịch vụ. Mọi hành vi lừa đảo, gian lận trong kinh doanh đều bị lên án và phải chịu hoàn
                                            toàn trách nhiệm trước pháp luật
                                        </p>
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
