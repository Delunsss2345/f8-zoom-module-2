export function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function formatNumber(number) {
  return number.toLocaleString("vi-VN");
}
