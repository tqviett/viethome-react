export function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Mảng các tên của các ngày trong tuần
    const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    // Lấy các thông tin về ngày, tháng, năm, giờ và phút
    const dayOfWeek = daysOfWeek[date.getDay()];
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    // Tạo chuỗi định dạng
    const formattedDate = `${dayOfWeek}, ${hours}:${minutes} ${day}/${month}/${year}`;

    return formattedDate;
}
