import { createElement } from "../../utils/helpers.js";

class PlaylistEdit {
  constructor(container) {
    this.container = container;
  }

  createPlaylistPage(imageUrl, playlistName) {
    this.container.innerHTML = "";

    const artistHero = createElement("section", {
      className: "artist-hero",
      attributes: {
        style: `
          padding: 32px;
          position: relative;
          display: flex;
          align-items: flex-end;
          min-height: 340px;
        `,
      },
    });

    // Chọn ảnh box
    const imageBox = createElement("div", {
      className: "playlist-image-box",
      attributes: {
        style: `
          width: 232px;
          height: 232px;
          background-color: #282828;
          border-radius: 8px;
          margin-right: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          position: relative;
          box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
        `,
      },
    });

    // Icon bút chì ở góc trên phải
    const pencilIcon = createElement("i", {
      className: "fas fa-pen",
      attributes: {
        style: `
          position: absolute;
          top: 12px;
          right: 12px;
          color: white;
          font-size: 16px;
          opacity: 0.7;
        `,
      },
    });

    const chooseTextVN = createElement("div", {
      textContent: "Chọn ảnh",
      attributes: {
        style: `
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          text-align: center;
        `,
      },
    });

    const chooseTextEN = createElement("div", {
      textContent: "Choose photo",
      attributes: {
        style: `
          font-size: 14px;
          opacity: 0.7;
          text-align: center;
        `,
      },
    });

    imageBox.appendChild(pencilIcon);
    imageBox.appendChild(chooseTextVN);
    imageBox.appendChild(chooseTextEN);

    const infoBox = createElement("div", {
      className: "playlist-info-box",
      attributes: {
        style: `
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          flex: 1;
        `,
      },
    });

    const publicLabel = createElement("div", {
      textContent: "Public Playlist",
      attributes: {
        style: `
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        `,
      },
    });

    const title = createElement("h1", {
      textContent: playlistName,
      attributes: {
        style: `
          font-size: 96px;
          font-weight: 900;
          margin: 0;
          margin-bottom: 16px;
          line-height: 0.9;
          letter-spacing: -0.04em;
        `,
      },
    });

    const author = createElement("div", {
      textContent: "Han • ",
      attributes: {
        style: `
          font-size: 14px;
          opacity: 0.7;
        `,
      },
    });

    infoBox.appendChild(publicLabel);
    infoBox.appendChild(title);
    infoBox.appendChild(author);

    artistHero.appendChild(imageBox);
    artistHero.appendChild(infoBox);

    const controlsSection = createElement("section", {
      className: "playlist-controls-section",
      attributes: {
        style: `
          padding: 24px 32px;
          background: #121212;
          display: flex;
          align-items: center;
          gap: 24px;
        `,
      },
    });

    const playBtn = createElement("button", {
      className: "play-btn-large",
      attributes: {
        style: `
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #1db954;
          border: none;
          color: black;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        `,
      },
    });

    const playIcon = createElement("i", {
      className: "fas fa-play",
      attributes: {
        style: "margin-left: 2px;",
      },
    });
    playBtn.appendChild(playIcon);

    const listButton = createElement("button", {
      className: "list-btn",
      attributes: {
        style: `
          margin-left: auto;
          background: transparent;
          border: none;
          color: #b3b3b3;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        `,
      },
    });

    const listText = createElement("span", { textContent: "List" });
    const listIcon = createElement("i", { className: "fas fa-list" });

    listButton.appendChild(listText);
    listButton.appendChild(listIcon);

    controlsSection.appendChild(playBtn);
    controlsSection.appendChild(listButton);

    const searchSection = createElement("section", {
      className: "search-section",
      attributes: {
        style: `
          padding: 32px;
          background: #121212;
        `,
      },
    });

    const searchTitle = createElement("h2", {
      textContent: "Let's find something for your playlist",
      attributes: {
        style: `
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: white;
        `,
      },
    });

    const searchInputContainer = createElement("div", {
      attributes: {
        style: `
          position: relative;
          max-width: 400px;
        `,
      },
    });

    const searchIcon = createElement("i", {
      className: "fas fa-search",
      attributes: {
        style: `
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #b3b3b3;
          font-size: 16px;
        `,
      },
    });

    const searchInput = createElement("input", {
      attributes: {
        type: "text",
        placeholder: "Search for songs or episodes",
        style: `
          width: 100%;
          padding: 12px 16px 12px 40px;
          border-radius: 4px;
          border: none;
          background-color: #242424;
          color: white;
          font-size: 14px;
          outline: none;
        `,
      },
    });

    searchInputContainer.appendChild(searchIcon);
    searchInputContainer.appendChild(searchInput);

    searchSection.appendChild(searchTitle);
    searchSection.appendChild(searchInputContainer);

    this.container.appendChild(artistHero);
    this.container.appendChild(controlsSection);
    this.container.appendChild(searchSection);

    imageBox.addEventListener("click", () => {
      console.log("Choose photo clicked");
    });

    infoButton.addEventListener("click", () => {
      console.log("Show info clicked");
    });

    closeButton.addEventListener("click", () => {
      console.log("Close clicked");
    });
  }
}

export default PlaylistEdit;
