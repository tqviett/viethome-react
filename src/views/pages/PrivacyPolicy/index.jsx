import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography, Grid, CardContent, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
    return (
        <>
            <Helmet>
                <title> Privacy-Policy </title>
            </Helmet>
            <Container>
                <Typography gutterBottom textAlign={'center'} variant="h2">
                    CHÍNH SÁCH BẢO MẬT
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
                                            <strong>Trách nhiệm bảo vệ thông tin cá nhân của người tiêu dùng.</strong>
                                        </p>
                                        <p>
                                            - Trong quá trình hoạt động kinh doanh thương mại điện tử, nếu VIET-HOME thực hiện việc thu thập
                                            thông tin cá nhân của người tiêu dùng thì sẽ đảm bảo tuân thủ các quy định pháp luật liên quan
                                            về bảo vệ thông tin cá nhân.
                                        </p>
                                        <p>
                                            <strong>Phạm vi sử dụng thông tin:</strong>
                                        </p>
                                        <p>- Các thông tin cá nhân được khách hàng cung cấp có thể dùng vào các mục đích sau:</p>
                                        <p>- Cung cấp hàng hóa, dịch vụ hay thực hiện những giao dịch mà Khách hàng yêu cầu;</p>
                                        <p>- Gửi thông tin đến Khách hàng;</p>
                                        <p>- Phân tích, đánh giá và hoàn thiện sản phẩm, dịch vụ (kể cả website), công nghệ, quy trình;</p>
                                        <p>- Nâng cao mối tương tác và liên kết với Khách hàng;</p>
                                        <p>- Liên hệ giải quyết với khách hàng trong những trường hợp cần thiết</p>
                                        <p>
                                            - Nếu không có sự đồng ý của Khách hàng, VIET-HOME sẽ không cung cấp dữ liệu cho bên thứ ba để
                                            họ dùng vào mục đích quảng cáo.
                                        </p>
                                        <p>
                                            <strong>Thời gian lưu trữ thông tin:</strong>
                                        </p>
                                        <p>
                                            - Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành
                                            viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ
                                            được bảo mật trên máy chủ của VIET-HOME.
                                        </p>

                                        <p>
                                            <strong>Cam kết bảo mật thông tin cá nhân khách hàng:</strong>
                                        </p>
                                        <p>
                                            Thông tin cá nhân của thành viên trên VIET-HOME được cam kết bảo mật tuyệt đối theo chính sách
                                            bảo vệ thông tin cá nhân của VIET-HOME. Việc thu thập và sử dụng thông tin của mỗi thành viên
                                            chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định
                                            khác.
                                        </p>
                                        <p>
                                            Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân
                                            của thành viên khi không có sự cho phép đồng ý từ thành viên
                                        </p>
                                        <p>
                                            Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân
                                            thành viên, VIET-HOME sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý
                                            kịp thời và thông báo cho thành viên được biết.
                                        </p>
                                        <p>
                                            Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của Thành viên bao gồm thông tin hóa đơn kế
                                            toán chứng từ số hóa tại khu vực dữ liệu trung tâm an toàn cấp 1 của VIET-HOME.
                                        </p>
                                        <p>
                                            Ban quản lý VIET-HOME yêu cầu các cá nhân khi đăng ký là thành viên, phải cung cấp đầy đủ thông
                                            tin cá nhân có liên quan như: Họ và tên, địa chỉ liên lạc, email, điện thoại, địa chỉ …., và
                                            chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban quản lý VIET-HOME không chịu
                                            trách nhiệm cũng như không giải quyết mọi khiếu nại có liên quan đến quyền lợi của Thành viên đó
                                            nếu xét thấy tất cả thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban đầu là không
                                            chính xác.
                                        </p>
                                        <p>
                                            <strong>Cơ chế tiếp nhận và giải quyết khiếu nại liên quan đến việc thông tin cá nhân </strong>
                                        </p>
                                        <p>
                                            Khi khách hàng gửi thông tin cá nhân của khách hàng cho chúng tôi, khách hàng đã đồng ý với các
                                            điều khoản mà chúng tôi đã nêu ở trên, VIET-HOME cam kết bảo mật thông tin cá nhân của các khách
                                            hàng bằng mọi cách thức có thể. Chúng tôi sử dụng các hệ thống mã hóa nhằm bảo vệ thông tin này
                                            không bị truy lục, sử dụng hoặc tiết lộ ngoài ý muốn.
                                        </p>
                                        <p>
                                            VIET-HOME cũng khuyến cáo các khách hàng nên bảo mật các thông tin liên quan đến mật khẩu truy
                                            xuất của các khách hàng và không nên chia sẻ với bất kỳ người nào khác.
                                        </p>
                                        <p>
                                            Trong trường hợp có phản ánh của khách hàng về việc sử dụng thông tin trái với mục đích đã nêu,
                                            VIET-HOME sẽ tiến hành giải quyết theo các bước sau:
                                        </p>
                                        <p>
                                            Bước 1: Khách hàng gửi thông tin phản hồi về việc thông tin cá nhân thu thập trái với mục đích
                                            đã nêu.
                                        </p>
                                        <p>
                                            Bước 2: Bộ phận Chăm sóc Khách hàng của VIET-HOME tiếp nhận và giải quyết với các bên có liên
                                            quan.
                                        </p>
                                        <p>
                                            Bước 3: Trong trường hợp vượt ra khỏi tầm kiểm soát của VIET-HOME, chúng tôi sẽ đưa ra các cơ
                                            quan có thẩm quyền để yêu cầu giải quyết
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
