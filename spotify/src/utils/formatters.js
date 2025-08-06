// Chuyển đổi thời lượng từ giây sang định dạng MM:SS
export function formatDuration(duration) {
  const minutes = Math.floor(duration / 60); // Lấy phần phút
  const seconds = (duration % 60).toString().padStart(2, "0"); // Lấy phần giây và thêm số 0
  return `${minutes}:${seconds}`;
}
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

//  Format số theo định dạng Việt Nam (dấu phẩy ngăn cách hàng nghìn)
export function formatNumber(number) {
  return number.toLocaleString("vi-VN");
}
