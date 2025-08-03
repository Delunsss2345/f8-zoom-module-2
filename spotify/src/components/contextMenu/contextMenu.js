import { MODAL_CLASSES } from "../../utils/constants.js";

class ContextMenu {
  constructor() {
    this.menu = null;
    this.currentBtn = null;
    this.createContextMenu();
    this.setupEvents();
  }

  createContextMenu() {
    this.menu = document.createElement("div");
    this.menu.className = "context-menu";

    document.body.appendChild(this.menu);
  }

  // Gắn sự kiện hiển thị context menu
  setupEvents() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // Ngăn menu mặc định của trình duyệt

      // Nếu click phải vào phần tử có class .library-item
      if (e.target.closest(".library-item")) {
        // Nếu phần tử đó còn có class .play-liked
        if (e.target.closest(".play-liked")) {
          this.menu.innerHTML = `
            <div class="context-menu-item"><i class="fas fa-user-minus"></i> Xoá khỏi profile</div>
            <div class="context-menu-item"><i class="fas fa-trash"></i> Xoá</div>`;
        } else {
          // Nếu là nghệ sĩ đã theo dõi
          this.menu.innerHTML = `
            <div class="context-menu-item"><i class="fas fa-times"></i> Hủy theo dõi</div>
            <div class="context-menu-item"><i class="fas fa-ban"></i> Không phát nghệ sĩ này</div>
          `;
        }

        // Gán vị trí hiển thị menu theo tọa độ chuột
        this.menu.style.top = `${e.pageY}px`;
        this.menu.style.left = `${e.pageX}px`;
        this.menu.classList.add(MODAL_CLASSES.SHOW); // Hiện menu
      } else {
        // Nếu click phải ngoài vùng cho phép thì ẩn menu
        this.menu.classList.remove(MODAL_CLASSES.SHOW);
      }
    });
  }

  get getMenu() {
    return this.menu;
  }
}

export default ContextMenu;
