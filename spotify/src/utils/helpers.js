//Xóa class "active" khỏi tất cả elements matching selector
export function removeActiveClass(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => element.classList.remove("active"));
}

// Bật/tắt scroll của body (dùng khi mở, đóng modal)
// Ngăn user scroll page khi modal đang mở
export function toggleBodyScroll(disable) {
  document.body.style.overflow = disable ? "hidden" : "auto";
}

// Tạo elements động
// Tạo DOM element với các options linh hoạt
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  // attributes format: {attributes : {alt : "huy", src: "image.jpg"}}
  // sẽ được convert thành array: [['alt', 'huy'], ['src', 'image.jpg']]
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}
// nguồn https://stackoverflow.com/questions/26667820/upload-a-base64-encoded-image-using-formdata
// Hàm chuyển base64 thành url
export function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(',');
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ia], { type: mimeString });
  
  console.log({
    size: blob.size,
    type: blob.type,
    sizeInMB: (blob.size / 1024 / 1024).toFixed(2) + ' MB'
  });

  return blob;
}
