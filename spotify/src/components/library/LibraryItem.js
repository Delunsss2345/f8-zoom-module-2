import { createElement, removeActiveClass } from "../../utils/helpers.js";

class LibraryItem {
  constructor(onArtistSelect) {
    this.onArtistSelect = onArtistSelect;
    this.libraryContent = document.querySelector(".library-content"); // Lấy content của nav
  }

  createLibraryItem(
    id,
    title,
    imageUrl,
    modePlayList = false,
    modeArtist = false,
    isActive = false
  ) {
    const container = createElement("div", {
      className: `library-item ${modePlayList ? "play-liked" : ""}`,
    });

    container.id = id;
    container.onclick = (e) => {
      removeActiveClass(".library-item");
      this.onArtistSelect(id);
      e.currentTarget.classList.add("active");
    };
    let img;
    if (!imageUrl || imageUrl === "https://example.com/playlist-cover.jpg") {
      img = createElement("div", {
        className: "item-icon liked-songs",
      });
      const icon = createElement("i", {
        className: "fas fa-heart",
      });
      img.appendChild(icon);
    } else {
      img = createElement("img", {
        className: "item-image",
        attributes: {
          src: imageUrl,
          alt: title,
        },
      });
    }

    const info = createElement("div", { className: "item-info" });
    let titleDiv;
    let subtitleDiv;
    if (modePlayList) {
      titleDiv = createElement("div", {
        className: "item-title",
        textContent: `${title}`,
      });

      const icon = createElement("i", {
        className: "fas fa-thumbtack",
      });
      subtitleDiv = createElement("div", {
        className: "item-subtitle",
        textContent: "Playlist",
      });

      subtitleDiv.prepend(icon);
    } else {
      titleDiv = createElement("div", {
        className: "item-title",
        textContent: title,
      });

      subtitleDiv = createElement("div", {
        className: "item-subtitle",
        textContent: "Artist",
      });
    }

    info.appendChild(titleDiv);
    info.appendChild(subtitleDiv);
    container.appendChild(img);
    container.appendChild(info);

    if (isActive) {
      container.classList.add("active");
    }

    if (modeArtist) {
      this.libraryContent.appendChild(container);
    }

    return container;
  }
}

export default LibraryItem;
