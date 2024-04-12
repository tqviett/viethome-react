import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Typography, Grid, CardContent, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router-dom';
import Illustration_404 from 'ui-component/illustration_404';
import Logo from 'ui-component/Logo';

export default function TermsOfUse() {
    return (
        <>
            <Helmet>
                <title> Terms-Of-Use </title>
            </Helmet>
            <Container>
                <Typography gutterBottom textAlign={'center'} variant="h2">
                    ĐIỀU KHOẢN SỬ DỤNG
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
                                            <strong>Trước khi bạn đăng tin lên website. xin vui lòng đọc kỹ các quy định sau đây:</strong>
                                        </p>
                                        <p>
                                            1. Không được đăng ký tài khoản và khai báo những thông tin giả mạo, đặt tên tài khoản phản cảm,
                                            thô tục
                                        </p>
                                        <p>2. Không được phép đăng tin liên quan đến các vấn đề mà pháp luật Việt Nam không cho phép.</p>
                                        <p>
                                            3. Không được đăng những bài viết, thông tin có nội dung vi phạm pháp luật: đả kích, bôi nhọ,
                                            chỉ trích hay bàn luận về chính trị, tôn giáo, phản động, kỳ thị văn hóa, dân tộc, cũng như vi
                                            phạm khác liên quan đến thuần phong mỹ tục của dân tộc Việt Nam.
                                        </p>
                                        <p>
                                            4. Tiêu đề và nội dung của tin đăng phải dùng tiếng Việt có dấu. Không được sử dụng từ ngữ thô
                                            tục, mất văn hoá.
                                        </p>
                                        <p>
                                            5. Tin đăng phải có địa chỉ liên lạc cụ thể không được cho địa chỉ sai. hay dùng thông tin địa
                                            chỉ của người khác
                                        </p>
                                        <p>
                                            6. Các bài viết không có nội dung hoặc nội dung không liên quan đến chuyên mục. Những bài viết
                                            này sẽ bị xóa mà không cần báo trước.
                                        </p>
                                        <p>7. Không tạo nhiều tài khoản để đăng tin, nếu chúng tôi phát hiện sẽ xóa và ban toàn bộ nick.</p>
                                        <p>
                                            8. Không được đăng quá nhiều tin trong ngày và không đăng tin có tiêu đề, nội dung tương tự
                                            nhau.
                                        </p>
                                        <p>
                                            9. Khi phát hiện tin đăng không đúng sự thật, hay chỗ cho thuê là dịch vụ hay cò nhà trọ, bạn
                                            vui lòng thông báo cho Ban quản trị biết để chúng tôi kịp thời xử lý.
                                        </p>
                                        <p>
                                            10. Những trường hợp cố tình spam, vi phạm nội quy nhiều lần thì chúng tôi sẽ cấm không cho bạn
                                            đăng tin và tất cả mọi tin đăng của bạn sẽ không được hiển thị trên
                                            <strong>VIET-HOME</strong>
                                        </p>

                                        <p>
                                            11.Tin đăng khi hết hạn nếu khách hàng không gia hạn lại sau thời gian nhất định hệ thống sẽ tự
                                            động xóa đi.
                                        </p>
                                        <p>
                                            <strong>
                                                Tất cả các tin đăng sai phạm quy định trên sẽ bị xóa mà không cần thông báo trước.
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>Chúng tôi không chịu trách nhiệm về nội dung các bài đăng trên website.</strong>
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
