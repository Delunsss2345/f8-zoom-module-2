import UploadService from "../../services/api/UploadService.js";
import { createElement } from "../../utils/helpers.js";

class ModelEditPlayList {
  constructor() {
    this.isVisible = false;
    this.playlistData = {
      name: "",
      description: "",
      image: null,
    };
    this.onSave = null;
    this.onCancel = null;
    this.modal = null;
    this.reloadLibraryComponent = null;
    this.accessToken = localStorage.getItem("accessToken");
  }

  render(options = {}) {
    const {
      playlistId = null,
      playlistName = "My Playlist", // Tên playlist mặc định
      playlistDescription = "", // Mô tả playlist mặc định
      playlistImage = null, // Ảnh playlist mặc định
      onSave = null,
      onCancel = null,
    } = options;
    this.playlistId = playlistId;
    // Lưu lại callback để gọi sau khi người dùng thao tác
    this.onSave = onSave;
    this.onCancel = onCancel;

    // Lưu dữ liệu playlist vào biến nội bộ
    this.playlistData = {
      name: playlistName,
      description: playlistDescription,
      image: playlistImage,
    };
    // Tạo modal DOM với nội dung từ playlist
    this.modal = this.createModal(
      playlistName,
      playlistDescription,
      playlistImage
    );

    // Gắn modal vào body để hiển thị trên trang
    document.body.appendChild(this.modal);
    this.isVisible = true;

    // Gán các sự kiện
    this.setupEventListeners();

    // Sau khi modal hiển thị, focus vào ô nhập tên playlist
    setTimeout(() => {
      const nameInput = this.modal.querySelector("#editPlaylistName");
      if (nameInput) {
        nameInput.focus(); // Đưa con trỏ vào ô input
        nameInput.select(); // Bôi đen toàn bộ text
      }
    }, 100);
  }

  // Tạo ra modal
  createModal(playlistName, playlistDescription, playlistImage) {
    const overlay = createElement("div", {
      className: "modal-edit-overlay",
      attributes: { id: "editPlaylistModal" },
    });

    const container = createElement("div", {
      className: "modal-edit-container",
    });

    const header = this.createHeader();

    const content = this.createContent(
      playlistName,
      playlistDescription,
      playlistImage
    );

    const footer = this.createFooter();

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);
    overlay.appendChild(container);

    return overlay;
  }

  // Tái tạo header modal edit
  createHeader() {
    const header = createElement("div", {
      className: "modal-edit-header",
    });

    const title = createElement("h2", {
      className: "modal-edit-title",
      textContent: "Edit details",
    });

    const closeBtn = createElement("button", {
      className: "modal-edit-close-btn",
      attributes: { type: "button" },
      innerHTML: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `,
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    return header;
  }

  // Tạo model content
  createContent(playlistName, playlistDescription, playlistImage) {
    const content = createElement("div", {
      className: "modal-edit-content",
    });

    const form = createElement("div", {
      className: "modal-edit-form",
    });

    const imageSection = this.createImageSection(playlistImage);

    const formFields = this.createFormFields(playlistName, playlistDescription);

    form.appendChild(imageSection);
    form.appendChild(formFields);
    content.appendChild(form);

    return content;
  }

  // Tak
  createImageSection(playlistImage) {
    const section = createElement("div", {
      className: "modal-edit-image-section",
    });

    const preview = createElement("div", {
      className: "modal-edit-image-preview",
      attributes: { id: "editImagePreview" },
    });

    if (playlistImage) {
      const img = createElement("img", {
        className: "modal-edit-preview-img",
        attributes: { src: playlistImage, alt: "Playlist cover" },
      });
      preview.appendChild(img);
    } else {
      const defaultImage = createElement("div", {
        className: "modal-edit-default-image",
        innerHTML: `
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        `,
      });
      preview.appendChild(defaultImage);
    }

    const overlay = createElement("div", {
      className: "modal-edit-image-overlay",
      innerHTML: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-3l1.25-2.75L16 10l-2.75 1.25L12 14l2.75-1.25L16 10z"/>
        </svg>
        <span>${playlistImage ? "Change photo" : "Choose photo"}</span>
      `,
    });

    preview.appendChild(overlay);

    const fileInput = createElement("input", {
      attributes: {
        type: "file",
        id: "editImageInput",
        accept: "image/*",
        style: "display: none;",
      },
    });

    section.appendChild(preview);
    section.appendChild(fileInput);

    return section;
  }

  createFormFields(playlistName, playlistDescription) {
    const fields = createElement("div", {
      className: "modal-edit-form-fields",
    });

    const nameGroup = createElement("div", {
      className: "modal-edit-form-group",
    });

    const nameInput = createElement("input", {
      className: "modal-edit-form-input",
      attributes: {
        type: "text",
        id: "editPlaylistName",
        value: playlistName,
        placeholder: "Playlist name",
      },
    });

    nameGroup.appendChild(nameInput);

    const descGroup = createElement("div", {
      className: "modal-edit-form-group",
    });

    const descTextarea = createElement("textarea", {
      className: "modal-edit-form-textarea",
      textContent: playlistDescription,
      attributes: {
        id: "editPlaylistDescription",
        placeholder: "Add an optional description",
        rows: "3",
      },
    });

    descGroup.appendChild(descTextarea);

    fields.appendChild(nameGroup);
    fields.appendChild(descGroup);

    return fields;
  }

  createFooter() {
    const footer = createElement("div", {
      className: "modal-edit-footer",
    });

    const disclaimer = createElement("div", {
      className: "modal-edit-disclaimer",
      innerHTML: `
        <p>By proceeding, you agree to give Spotify access to the image you choose to upload. 
        Please make sure you have the right to upload the image.</p>
      `,
    });

    const saveBtn = createElement("button", {
      className: "modal-edit-save-btn",
      textContent: "Save",
      attributes: { type: "button", id: "editSaveBtn" },
    });

    footer.appendChild(disclaimer);
    footer.appendChild(saveBtn);

    return footer;
  }

  setupEventListeners() {
    if (!this.modal) return; // Nếu modal chưa được tạo thì thoát ra

    // Bắt sự kiện click vào nút "x" để đóng modal
    const closeBtn = this.modal.querySelector(".modal-edit-close-btn");
    closeBtn?.addEventListener("click", () => this.close());

    // Bắt sự kiện click ra ngoài modal (vào overlay) để đóng modal
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Bắt sự kiện phím
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Mở hộp chọn file khi click vào ảnh
    const imagePreview = this.modal.querySelector("#editImagePreview");
    const imageInput = this.modal.querySelector("#editImageInput");

    imagePreview?.addEventListener("click", () => {
      imageInput?.click(); // Kích hoạt input file
    });

    // Khi chọn file ảnh, xử lý và hiển thị ảnh mới
    imageInput?.addEventListener("change", (e) => {
      this.handleImageUpload(e);
    });

    // Bắt sự kiện click vào nút "Save" để lưu dữ liệu
    const saveBtn = this.modal.querySelector("#editSaveBtn");
    saveBtn?.addEventListener("click", () => this.handleSave());

    // Tự động tăng chiều cao của textarea khi người dùng nhập thêm dòng
    const textarea = this.modal.querySelector("#editPlaylistDescription");
    textarea?.addEventListener("input", (e) => {
      e.target.style.height = "auto"; // Reset lại để đo chiều cao mới
      e.target.style.height = e.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
    });
  }

  handleKeyDown(e) {
    if (!this.isVisible) return;

    if (e.key === "Escape") {
      this.close();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      this.handleSave();
    }
  }

  handleImageUpload(e) {
    const file = e.target.files[0]; // Lấy file đầu tiên từ input[type="file"]
    if (!file) return; // Nếu không có file nào được chọn thì thoát

    // Danh sách các định dạng ảnh hợp lệ
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader(); // Tạo đối tượng đọc file
    reader.onload = async (e) => {
      // Khi đọc file xong, tiến hành hiển thị ảnh
      const imagePreview = this.modal.querySelector("#editImagePreview"); // Thẻ chứa ảnh preview
      if (imagePreview) {
        imagePreview.innerHTML = ""; // Xóa nội dung hiện tại (nếu có)

        // Tạo thẻ <img> mới để hiển thị ảnh vừa chọn
        const img = createElement("img", {
          className: "modal-edit-preview-img",
          attributes: { src: e.target.result, alt: "Playlist cover" },
        });

        // Tạo lớp overlay với icon và chữ "Change photo"
        const overlay = createElement("div", {
          className: "modal-edit-image-overlay",
          innerHTML: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-3l1.25-2.75L16 10l-2.75 1.25L12 14l2.75-1.25L16 10z"/>
          </svg>
          <span>Change photo</span>
        `,
        });

        // Thêm ảnh và overlay vào khung preview
        imagePreview.appendChild(img);
        imagePreview.appendChild(overlay);
      }

      // Lưu đường dẫn ảnh vào dữ liệu playlist
      this.playlistData.image = e.target.result;
      
    };

    // Đọc file thành dạng URL base64 để hiển thị ảnh
    reader.readAsDataURL(file);
  }

  handleSave() {
    // Tìm input nhập tên playlist
    const nameInput = this.modal.querySelector("#editPlaylistName");
    // Tìm input nhập mô tả playlist
    const descriptionInput = this.modal.querySelector(
      "#editPlaylistDescription"
    );

    if (!nameInput) return; // Nếu không tìm thấy ô tên thì thoát

    const name = nameInput.value.trim(); // Lấy giá trị tên và loại bỏ khoảng trắng thừa
    if (!name) {
      // Nếu tên bị bỏ trống, cảnh báo và focus lại vào input
      nameInput.focus();
      return;
    }

    // Tạo object chứa dữ liệu playlist đã cập nhật
    const updatedData = {
      name: name,
      description: descriptionInput?.value.trim() || "", // Mô tả có thể rỗng
      image: this.playlistData.image, // Ảnh lấy từ biến lưu trữ trước đó
    };

    // Gọi hàm callback `onSave` nếu có (thường để xử lý lưu vào backend hoặc cập nhật giao diện)
    if (this.onSave && typeof this.onSave === "function") {
      this.onSave(updatedData); // Truyền dữ liệu cập nhật vào
    }
    
    this.close(); // Đóng modal sau khi lưu
  }

  close() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }

    this.isVisible = false;
    document.removeEventListener("keydown", this.handleKeyDown);

    if (this.onCancel && typeof this.onCancel === "function") {
      this.onCancel();
    }
  }

  isOpen() {
    return this.isVisible;
  }

  updateData(data) {
    this.playlistData = { ...this.playlistData, ...data };
  }
}

export default ModelEditPlayList;
