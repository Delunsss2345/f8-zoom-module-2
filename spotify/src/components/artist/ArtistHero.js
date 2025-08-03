import { formatNumber } from "../../utils/formatters.js";
import { createElement } from "../../utils/helpers.js";
import TrackList from "./TrackList.js";

class ArtistHero {
  constructor(container, tracks) {
    this.player = document.querySelector(".player");
    this.audio = document.getElementById("audioPlay");
    this.process = document.querySelector(".progress-fill");
    this.container = container;
  }
  createArtistPage(imageUrl, artistName, monthlyListeners) {
    const contentWrapper = createElement("div", {
      className: "content-wrapper",
    });

    const artistHero = createElement("section", { className: "artist-hero" });

    const heroBackground = createElement("div", {
      className: "hero-background",
    });
    const img = createElement("img", {
      className: "hero-image",
      attributes: {
        src: imageUrl,
        alt: `${artistName} artist background`,
      },
    });
    const overlay = createElement("div", { className: "hero-overlay" });

    heroBackground.appendChild(img);
    heroBackground.appendChild(overlay);

    const heroContent = createElement("div", { className: "hero-content" });

    const verified = createElement("div", {
      className: "verified-badge",
      innerHTML: `<i class="fas fa-check-circle"></i><span>Verified Artist</span>`,
    });

    const name = createElement("h1", {
      className: "artist-name",
      textContent: artistName,
    });

    const listeners = createElement("p", {
      className: "monthly-listeners",
      textContent: `${formatNumber(monthlyListeners)} monthly listeners`,
    });

    heroContent.appendChild(verified);
    heroContent.appendChild(name);
    heroContent.appendChild(listeners);

    artistHero.appendChild(heroBackground);
    artistHero.appendChild(heroContent);

    const artistControls = createElement("section", {
      className: "artist-controls",
    });
    const playBtn = createElement("button", { className: "play-btn-large" });
    const playIcon = createElement("i", { className: "fas fa-play" });

    const followBtn = createElement("button", {
      className: "follow-btn",
      textContent: "Theo dõi",
    });

    playBtn.appendChild(playIcon);
    artistControls.appendChild(playBtn);
    artistControls.appendChild(followBtn);

    const popularSection = createElement("section", {
      className: "popular-section",
    });
    const popularTitle = createElement("h2", {
      className: "section-title",
      textContent: "Popular",
    });
    const trackList = createElement("div", { className: "track-list" });

    popularSection.appendChild(popularTitle);
    popularSection.appendChild(trackList);

    contentWrapper.appendChild(artistHero);
    contentWrapper.appendChild(artistControls);
    contentWrapper.appendChild(popularSection);

    return contentWrapper;
  }

  render(artistData, tracks) {
    const { background_image_url, name, monthly_listeners } = artistData;
    console.log({ background_image_url, name, monthly_listeners });
    this.container.innerHTML = "";
    this.container.appendChild(
      this.createArtistPage(background_image_url, name, monthly_listeners)
    );
    this.trackList = document.querySelector(".track-list");
    this.trackListComponent = new TrackList(
      this.trackList,
      this.audio,
      this.process,
      this.player
    );
    this.trackListComponent.init(tracks, artistData.name);
  }
}

export default ArtistHero;
