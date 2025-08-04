import ArtistService from "../../services/api/ArtistService.js";
import { formatNumber } from "../../utils/formatters.js";
import { createElement } from "../../utils/helpers.js";
import LibraryItem from "../library/LibraryItem.js";
import TrackList from "./TrackList.js";

class ArtistHero {
  constructor(container, tracks) {
    this.player = document.querySelector(".player");
    this.audio = document.getElementById("audioPlay");
    this.process = document.querySelector(".progress-fill");
    this.container = container;
    this.accessToken = localStorage.getItem("accessToken");
    this.libraryItemComponent = new LibraryItem((id) => {
      this.artistId = id;
      this.handleArtistSelect(id);
    });
  }

  // Hàm để theo dõi
  async handlerFollow(e, id) {
    if (e.target.classList.contains("following")) {
      e.target.textContent = "Theo dõi";

      ArtistService.unfollowArtist(this.accessToken, id);
    } else {
      e.target.textContent = "Đang theo dõi";
      const data = await Promise.all([
        ArtistService.followArtist(this.accessToken, id),
        ArtistService.getArtistById(id),
      ]);
      const artist = data[1].data;
      this.libraryItemComponent.createLibraryItem(
        artist.id,
        artist.name,
        artist.image_url,
        false,
        true
      );
    }
    e.target.classList.toggle("following");
  }

  async handleArtistSelect(id) {
    try {
      const { artist, tracks } = await ArtistService.getArtistDetails(
        id,
        this.accessToken
      );

      this.contentComponent.render(
        artist,
        tracks,
        artist.id,
        artist.is_following
      );
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
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

    if (id) {
      followBtn.onclick = (e) => {
        this.handlerFollow(e, id);
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
