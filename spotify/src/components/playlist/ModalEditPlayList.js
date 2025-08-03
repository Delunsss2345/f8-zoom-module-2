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
  }

  render(options = {}) {
    const {
      playlistName = "My Playlist #3",
      playlistDescription = "",
      playlistImage = null,
      onSave = null,
      onCancel = null,
    } = options;

    this.onSave = onSave;
    this.onCancel = onCancel;
    this.playlistData = {
      name: playlistName,
      description: playlistDescription,
      image: playlistImage,
    };

    this.close();

    this.modal = this.createModal(
      playlistName,
      playlistDescription,
      playlistImage
    );

    document.body.appendChild(this.modal);
    this.isVisible = true;

    this.setupEventListeners();

    setTimeout(() => {
      const nameInput = this.modal.querySelector("#editPlaylistName");
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    }, 100);
  }

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
    if (!this.modal) return;

    const closeBtn = this.modal.querySelector(".modal-edit-close-btn");
    closeBtn?.addEventListener("click", () => this.close());

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    const imagePreview = this.modal.querySelector("#editImagePreview");
    const imageInput = this.modal.querySelector("#editImageInput");

    imagePreview?.addEventListener("click", () => {
      imageInput?.click();
    });

    imageInput?.addEventListener("change", (e) => {
      this.handleImageUpload(e);
    });

    const saveBtn = this.modal.querySelector("#editSaveBtn");
    saveBtn?.addEventListener("click", () => this.handleSave());

    const textarea = this.modal.querySelector("#editPlaylistDescription");
    textarea?.addEventListener("input", (e) => {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
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
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = this.modal.querySelector("#editImagePreview");
      if (imagePreview) {
        imagePreview.innerHTML = "";

        const img = createElement("img", {
          className: "modal-edit-preview-img",
          attributes: { src: e.target.result, alt: "Playlist cover" },
        });

        const overlay = createElement("div", {
          className: "modal-edit-image-overlay",
          innerHTML: `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-3l1.25-2.75L16 10l-2.75 1.25L12 14l2.75-1.25L16 10z"/>
            </svg>
            <span>Change photo</span>
          `,
        });

        imagePreview.appendChild(img);
        imagePreview.appendChild(overlay);
      }
      this.playlistData.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  handleSave() {
    const nameInput = this.modal.querySelector("#editPlaylistName");
    const descriptionInput = this.modal.querySelector(
      "#editPlaylistDescription"
    );

    if (!nameInput) return;

    const name = nameInput.value.trim();
    if (!name) {
      alert("Playlist name is required");
      nameInput.focus();
      return;
    }

    const updatedData = {
      name: name,
      description: descriptionInput?.value.trim() || "",
      image: this.playlistData.image,
    };

    if (this.onSave && typeof this.onSave === "function") {
      this.onSave(updatedData);
    }

    this.close();
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
