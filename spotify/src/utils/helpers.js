//
export function removeActiveClass(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => element.classList.remove("active"));
}

export function toggleBodyScroll(disable) {
  document.body.style.overflow = disable ? "hidden" : "auto";
}

// Tối ưu hàm createElement
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

  // attribute {attributes : {alt : "huy"}} -> ['alt' , 'huy']}
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}
