import { createElement, removeActiveClass } from "../../utils/helpers.js";

class LibraryItem {
  constructor(onArtistSelect) {
    this.onArtistSelect = onArtistSelect;
  }

  createLibraryItem(id, title, imageUrl, isActive = false) {
    const container = createElement("div", { className: "library-item" });

    container.onclick = (e) => {
      removeActiveClass(".library-item");
      this.onArtistSelect(id);
      e.currentTarget.classList.add("active");
    };

    const img = createElement("img", {
      className: "item-image",
      attributes: {
        src: imageUrl,
        alt: title,
      },
    });

    const info = createElement("div", { className: "item-info" });

    const titleDiv = createElement("div", {
      className: "item-title",
      textContent: title,
    });

    const subtitleDiv = createElement("div", {
      className: "item-subtitle",
      textContent: "Artist",
    });

    info.appendChild(titleDiv);
    info.appendChild(subtitleDiv);
    container.appendChild(img);
    container.appendChild(info);

    if (isActive) {
      container.classList.add("active");
    }

    return container;
  }
}

export default LibraryItem;
