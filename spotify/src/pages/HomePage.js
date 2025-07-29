import ArtistHero from "../components/artist/ArtistHero.js";
import TrackList from "../components/artist/TrackList.js";
import AuthModal from "../components/auth/AuthModal.js";
import UserDropdown from "../components/auth/UserDropdown.js";
import LibraryItem from "../components/library/LibraryItem.js";
import ArtistService from "../services/api/ArtistService.js";

class HomePage {
  constructor() {
    this.libraryContent = document.querySelector(".library-content");
    this.artistHero = document.querySelector(".artist-hero");
    this.trackList = document.querySelector(".track-list");
    this.player = document.querySelector(".player");
    this.audio = document.getElementById("audioPlay");
    this.process = document.querySelector(".progress-fill");

    this.authModal = new AuthModal();
    this.userDropdown = new UserDropdown();

    this.artistHeroComponent = new ArtistHero(this.artistHero);
    this.trackListComponent = new TrackList(
      this.trackList,
      this.audio,
      this.process,
      this.player
    );
    this.libraryItemComponent = new LibraryItem((id) => {
      this.artistId = id;
      this.handleArtistSelect(id);
    });

    this.init();
  }

  async init() {
    this.setUpEvent();
    await this.loadArtists();
  }

  setUpEvent() {
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");

    signupBtn.addEventListener("click", () => {
      this.authModal.openWithSignup();
    });

    loginBtn.addEventListener("click", () => {
      this.authModal.openWithLogin();
    });
  }

  async handleArtistSelect(id) {
    try {
      const { artist, tracks } = await ArtistService.getArtistDetails(id);

      this.artistHeroComponent.render(artist);
      this.trackListComponent.init(tracks, artist.name);
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
  }

  async loadArtists() {
    try {
      const response = await ArtistService.getArtists();

      if (response.success) {
        this.renderLibrary(response.data.artists);
      }
    } catch (error) {
      console.error("Lỗi lấy artists", error);
    }
  }

  renderLibrary(artists) {
    artists.forEach((artist, idx) => {
      const isFirst = idx === 0; // là cái đầu tiên hiện ra thì active
      const libraryItem = this.libraryItemComponent.createLibraryItem(
        artist.id,
        artist.name,
        artist.image_url,
        isFirst
      );

      this.libraryContent.appendChild(libraryItem);

      if (isFirst) {
        this.artistId = artist.id;
        this.handleArtistSelect(artist.id);
      }
    });
  }
}

export default HomePage;
