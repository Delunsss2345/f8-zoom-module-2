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
