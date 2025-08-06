import { formatNumber } from "../../utils/formatters.js";
import {
  createElement,
  handlerFollow,
  handleSelect,
} from "../../utils/helpers.js";
import LibraryItem from "../library/LibraryItem.js";
import TrackList from "./TrackList.js";

class ArtistHero {
  constructor(
    container,
    setLibraryFull,
    getLibraryFull,
    getLibraryArtist,
    setLibraryArtist
  ) {
    this.setLibraryNow = setLibraryFull; // set  hàm chứa playlist  hiện tại
    this.getLibraryNow = getLibraryFull; // get hàm chứa playlist  hiện tại
    this.setLibraryArtistNow = setLibraryArtist; // set hàm chứa artist hiện tại
    this.getLibraryArtistNow = getLibraryArtist; // get hàm chứa artist hiện tại
    this.player = document.querySelector(".player");
    this.audio = document.getElementById("audioPlay");
    this.process = document.querySelector(".progress-fill");
    this.container = container;
    this.accessToken = localStorage.getItem("accessToken");
    this.libraryItemSelect = null;

    this.libraryItemComponent = new LibraryItem((id, libraryContent = null) => {
      this.artistId = id;
      handleSelect(id, this.accessToken, this);
    });
  }

  createArtistPage(
    imageUrl,
    artistName,
    monthlyListeners,
    id = null,
    isFollowing = false
  ) {
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
    if (isFollowing) {
      followBtn.classList.add("following");
      followBtn.textContent = "Đang theo dõi";
    }

    if (id && this.accessToken) {
      followBtn.onclick = (e) => {
        handlerFollow(
          e,
          id,
          this.accessToken,
          this.getLibraryNow,
          this.setLibraryNow,
          this.getLibraryArtistNow,
          this.setLibraryArtistNow,
          this.libraryItemComponent
        );
      };
    }

    artistControls.appendChild(followBtn);

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

  render(artistData, tracks, id, isFollowing = false) {
    const { background_image_url, name, monthly_listeners } = artistData;
    this.container.innerHTML = "";
    this.container.appendChild(
      this.createArtistPage(
        background_image_url,
        name,
        monthly_listeners,
        id,
        isFollowing
      )
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
