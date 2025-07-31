import ArtistHero from "../components/artist/ArtistHero.js";
import AuthButton from "../components/auth/AuthButton.js";
import AuthModal from "../components/auth/AuthModal.js";
import ContextMenu from "../components/contextMenu/contextMenu.js";
import Home from "../components/home/Home.js";
import LibraryItem from "../components/library/LibraryItem.js";
import SortDropdown from "../components/library/SortDropdown.js";
import ArtistService from "../services/api/ArtistService.js";
import TrackService from "../services/api/TrackService.js";
import { MODAL_CLASSES } from "../utils/constants.js";

class HomePage {
  constructor() {
    this.library = [];
    this.libraryContent = document.querySelector(".library-content");
    this.contentWrapper = document.querySelector(".content-wrapper");
    this.headerAction = document.querySelector(".header-actions");
    this.authBtn = document.querySelector(".auth-buttons");
    this.sortDropdown = new SortDropdown();
    this.contextMenuComponent = new ContextMenu();
    this.contentComponent = new ArtistHero(this.contentWrapper);
    this.HomeComponent = new Home(this.contentWrapper);
    this.libraryItemComponent = new LibraryItem((id) => {
      this.artistId = id;
      this.handleArtistSelect(id);
    });
    this.user = JSON.parse(localStorage.getItem("user"));
    this.authButton = new AuthButton(this.headerAction, !!this.user);
    this.authButton.render();

    this.authModal = new AuthModal();

    this.init();
  }

  async init() {
    await this.loadArtists();
    await this.loadPopularTracks();
    this.setUpEvent();
  }

  setUpEvent() {
    const searchBtn = document.querySelector(".search-library-btn");
    const inputSearch = document.querySelector(".search-library-input");
    const homeBtn = document.querySelector(".home-btn");
    const signupBtn = this.headerAction.querySelector(".signup-btn");
    const loginBtn = this.headerAction.querySelector(".login-btn");

    if (signupBtn && loginBtn) {
      signupBtn.onclick = () => {
        this.authModal.openWithSignup();
      };

      loginBtn.onclick = () => {
        this.authModal.openWithLogin();
      };
    }

    homeBtn.addEventListener("click", () => {
      this.contentWrapper.innerHTML = "";
      this.HomeComponent.render(this.library);
      this.HomeComponent.render(
        this.popularTracks,
        "Nhạc phổ biến hiện nay",
        "album"
      );
    });

    let debounceTimer;

    inputSearch.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        console.log(e.target.value);
        this.renderLibrary(this.library, undefined, e.target.value);
      }, 800);
    });

    searchBtn.addEventListener("click", () => {
      inputSearch.style.visibility = "visible";
      inputSearch.style.opacity = "1";
      const textSort = document.querySelector(".text-sort");
      textSort.innerHTML = "";
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-library")) {
        inputSearch.style.visibility = "hidden";
        inputSearch.style.opacity = "0";
        inputSearch.value = "";

        const textSort = document.querySelector(".text-sort");
        textSort.innerHTML = this.sortDropdown.getCurrentSort;
      }
      this.contextMenuComponent.getMenu.classList.remove(MODAL_CLASSES.SHOW);
    });

    document.addEventListener("sortChanged", (e) => {
      this.handleSortChange(e.detail);
    });

    document.addEventListener("viewChanged", (e) => {
      this.handleViewChange(e.detail);
      this.detail = e.detail;
    });
  }

  async handleArtistSelect(id) {
    try {
      const { artist, tracks } = await ArtistService.getArtistDetails(id);
      this.contentComponent.render(artist, tracks);
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
  }

  async loadArtists() {
    try {
      const response = await ArtistService.getArtists();

      if (response.success) {
        const data = response.data.artists;
        this.library = data;
        this.renderLibrary(data);
        this.HomeComponent.render(data);
      }
    } catch (error) {
      console.error("Lỗi lấy artists", error);
    }
  }

  async loadPopularTracks() {
    try {
      const response = await TrackService.getPopularTracks();

      if (response.success) {
        const data = response.data.tracks;
        this.popularTracks = data;
        this.HomeComponent.render(data, "Nhạc phổ biến hiện nay", "album");
      }
    } catch (error) {
      console.error("Lỗi lấy artists", error);
    }
  }

  sortArtists(artists, sortBy) {
    if (!sortBy || !sortBy.sortBy) return artists;

    const sorted = [...artists];

    switch (sortBy.sortBy) {
      case "name":
      case "alphabetical":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "creator":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;

      case "recent":
        sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        break;

      default:
        break;
    }

    return sorted;
  }

  filterArtists(artists, value) {
    if (!value) return;
    let sorted = [...artists];
    sorted = sorted.filter((sort) =>
      sort.name.toLowerCase().includes(value.toLowerCase())
    );

    return sorted;
  }

  renderLibrary(artists, sortBy, value) {
    if (sortBy) {
      console.log(sortBy);
      artists = this.sortArtists(artists, sortBy);
    }

    if (value) {
      artists = this.filterArtists(artists, value);
    }

    this.libraryContent.innerHTML = "";
    artists.forEach((artist, idx) => {
      const libraryItem = this.libraryItemComponent.createLibraryItem(
        artist.id,
        artist.name,
        artist.image_url
      );

      this.libraryContent.appendChild(libraryItem);
    });

    if (this.detail) {
      this.handleViewChange(this.detail);
    }
  }

  handleSortChange(detail) {
    this.renderLibrary(this.library, detail);
  }

  handleViewChange(detail) {
    const libraryItems = document.querySelectorAll(".library-item");

    libraryItems.forEach((item) => {
      item.classList.remove(
        "list-view",
        "compact-view",
        "grid-view",
        "grid-large-view"
      );
    });

    const viewClass = `${detail.viewType.replace("-", "-")}-view`;
    libraryItems.forEach((item) => {
      item.classList.add(viewClass);
    });
  }
}

export default HomePage;
