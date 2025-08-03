// Chuyển đổi thời lượng từ giây sang định dạng MM:SS
export function formatDuration(duration) {
  const minutes = Math.floor(duration / 60); // Lấy phần phút
  const seconds = (duration % 60).toString().padStart(2, "0"); // Lấy phần giây và thêm số 0
  return `${minutes}:${seconds}`;
}

//  Format số theo định dạng Việt Nam (dấu phẩy ngăn cách hàng nghìn)
export function formatNumber(number) {
  return number.toLocaleString("vi-VN");
}
