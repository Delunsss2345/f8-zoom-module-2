import { createElement } from "../../utils/helpers.js";

class Playlist {
  constructor(container) {
    this.container = container;
  }

  createPlaylistPage(imageUrl, playlistName) {
    this.container.innerHTML = "";

    const contentWrapper = createElement("div", {
      className: "content-wrapper",
    });

    const artistHero = createElement("section", { className: "artist-hero" });

    const heroBackground = createElement("div", {
      className: "hero-background",
    });

    const playlistImageContainer = createElement("div", {
      className: "playlist-image-container",
      attributes: {
        style: `
          position: absolute;
          left: 24px;
          bottom: 24px;
          width: 232px;
          height: 232px;
          z-index: 3;
        `,
      },
    });

    const img = createElement("div", {
      className: "hero-image playlist-cover",
      attributes: {
        style: `
          width: 232px;
          height: 232px;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 60px rgba(0, 0, 0, 0.5);
          font-size: 80px;
          color: white;
          font-weight: 300;
        `,
      },
      textContent: "♡",
    });

    playlistImageContainer.appendChild(img);

    const overlay = createElement("div", {
      className: "hero-overlay",
      attributes: {
        style: `
          background: linear-gradient(180deg, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(59, 130, 246, 0.2) 30%, 
            rgba(0, 0, 0, 0.6) 100%);
        `,
      },
    });

    heroBackground.appendChild(overlay);
    heroBackground.appendChild(playlistImageContainer);

    const heroContent = createElement("div", {
      className: "hero-content",
      attributes: {
        style: `
          position: absolute;
          bottom: 24px;
          left: 280px;
          z-index: 3;
        `,
      },
    });

    const playlistLabel = createElement("span", {
      className: "playlist-label",
      textContent: "Playlist",
      attributes: {
        style: `
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: white;
          opacity: 0.8;
        `,
      },
    });

    const name = createElement("h1", {
      className: "artist-name",
      textContent: playlistName,
      attributes: {
        style: `
          font-size: 96px;
          font-weight: 900;
          color: white;
          margin: 0;
          line-height: 1;
          letter-spacing: -0.025em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `,
      },
    });

   

    heroContent.appendChild(playlistLabel);
    heroContent.appendChild(name);

    artistHero.appendChild(heroBackground);
    artistHero.appendChild(heroContent);

    const artistControls = createElement("section", {
      className: "artist-controls",
    });

    const playBtn = createElement("button", { className: "play-btn-large" });
    const playIcon = createElement("i", { className: "fas fa-play" });
    playBtn.appendChild(playIcon);

    artistControls.appendChild(playBtn);

    const popularSection = createElement("section", {
      className: "popular-section",
    });

    contentWrapper.appendChild(artistHero);
    contentWrapper.appendChild(artistControls);
    contentWrapper.appendChild(popularSection);
    this.container.appendChild(contentWrapper);
  }
}

export default Playlist;
