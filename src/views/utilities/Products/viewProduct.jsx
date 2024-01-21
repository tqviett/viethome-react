import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button, IconButton, Box, TextField, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const listType = ['DYI', 'Thành phẩm', 'Hoa', 'Thú', 'Gương', 'Khác'];
const ViewProduct = () => {
    const [category, setCategory] = useState([{ id: 1, type: 'Trắng', category: 'DYI', total: 10, sold: 3 }]);
    const handleAddCategory = () => setCategory([...category, { id: new Date().getTime(), category: '', color: '', total: 0, sold: 0 }]);
    const handleRemoveCategory = (id) => {
        const newList = [...category].filter((item) => item.id !== id);
        setCategory(newList);
    };

    return (
        <>
            <Helmet>
                <title> Dashboard: View Product | KHEO-DYN </title>
            </Helmet>
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Thông tin sản phẩm
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
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            width: 300,
                            height: 300,
                            boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                            borderRadius: 1
                        }}
                    >
                        {/* <img alt="product-img" style={{ maxWidth: 300 }} height={300} src={URL.createObjectURL(dataForm.image)} /> */}
                    </Stack>
                    <Stack
                        sx={{
                            width: '65%'
                        }}
                    >
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { mb: 4, mt: 3, width: '100%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Box>Tên sản phẩm: Hoa hướng dương</Box>
                            <TextField id="name" label="Tên sản phẩm" defaultValue="Hoa hướng dương" />
                            <TextField required id="quantity" label="Số lượng" type="number" defaultValue={10} />
                            <TextField required id="quantity" label="Số lượng sản phầm đã bán" type="number" defaultValue={2} />
                            <TextField
                                required
                                id="price"
                                label="Giá sản phẩm"
                                type="number"
                                defaultValue={299000}
                                helperText={`${'299000'.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} VNĐ`}
                            />
                            <Autocomplete
                                multiple
                                id="type2"
                                options={listType}
                                defaultValue={[listType[1]]}
                                renderInput={(params) => <TextField {...params} label="Loại sản phẩm" placeholder="Phân loại" />}
                            />
                            <TextField id="note" label="Ghi chú" multiline rows={5} defaultValue="Ghi chú cho sản phẩm" />
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Phân loại sản phẩm
                            </Typography>
                            {category.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        alignItems: 'center',
                                        mb: 2,
                                        '& .MuiTextField-root': {
                                            mb: 0,
                                            '&:nth-child(3)': {
                                                width: 180
                                            },
                                            '&:nth-child(1)': {
                                                width: 240
                                            },
                                            '&:nth-child(4)': {
                                                width: 180
                                            }
                                        }
                                    }}
                                >
                                    <TextField label="Loại" id="category-type" value={item.type} size="small" />
                                    <Autocomplete
                                        id="type"
                                        sx={{ width: 300 }}
                                        size="small"
                                        options={listType}
                                        value={item.category}
                                        renderInput={(params) => <TextField {...params} label="Loại sản phẩm" placeholder="Phân loại" />}
                                    />
                                    <TextField label="Số lượng" id="category-number" type="number" value={item.total} size="small" />
                                    <TextField label="Đã bán" id="category-number" type="number" value={item.sold} size="small" />
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
                                Thêm loại
                            </Button>

                            <CKEditor
                                editor={ClassicEditor}
                                data="<p>Mô tả sản phẩm</p>"
                                onReady={(editor) => {
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    console.log({ event, editor, data });
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                        </Box>
                        <Button color="secondary" variant="contained" endIcon={<AddIcon />} sx={{ width: 200, marginLeft: 'auto', mt: 3 }}>
                            Thêm mới sản phẩm
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default ViewProduct;
