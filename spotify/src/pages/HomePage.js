import ArtistHero from "../components/artist/ArtistHero.js";
import AuthButton from "../components/auth/AuthButton.js";
import AuthModal from "../components/auth/AuthModal.js";
import ContextMenu from "../components/contextMenu/contextMenu.js";
import Home from "../components/home/Home.js";
import LibraryItem from "../components/library/LibraryItem.js";
import SortDropdown from "../components/library/SortDropdown.js";
import Playlist from "../components/playlist/PLayList.js";
import PlaylistEdit from "../components/playlist/PlayListEdit.js";
import ArtistService from "../services/api/ArtistService.js";
import PlayListService from "../services/api/PlayListService.js";
import TrackService from "../services/api/TrackService.js";
import { MODAL_CLASSES } from "../utils/constants.js";
import { removeActiveClass } from "../utils/helpers.js";

class HomePage {
  constructor() {
    this.library = [];
    this.libraryContent = document.querySelector(".library-content"); // Lấy content của nav
    this.contentWrapper = document.querySelector(".content-wrapper"); // Lấy lớp bọc
    this.headerAction = document.querySelector(".header-actions"); // Lấy header chứa login user
    this.authBtn = document.querySelector(".auth-buttons"); // Lấy nút bấm
    this.sortDropdown = new SortDropdown(); // Khởi tạo dropdown
    this.contextMenuComponent = new ContextMenu(); // Tạo context Menu
    this.contentComponent = new ArtistHero(this.contentWrapper); // Tạo đối tượng render content khi click
    this.playListComponent = new Playlist(this.contentWrapper); // Tạo đối tượng play list
    this.playListEditComponent = new PlaylistEdit(this.contentWrapper); // Tạo đối tượng edit play list
    this.HomeComponent = new Home(this.contentWrapper, this.handleArtistHome); // Khởi tạo home để hộ trợ hiện aristi
    this.libraryItemComponent = new LibraryItem((id) => {
      // Tạo đói tượng truyền hàm để hổ trợ mỗi library có 1 click
      this.artistId = id; // Gắn id artistId
      this.handleArtistSelect(id); // Gắn hàm ở HomePage vào
    });
    this.user = JSON.parse(localStorage.getItem("user")); // Get trước user lúc khởi tạo
    this.accessToken = localStorage.getItem("accessToken"); // Get trước accessToken
    this.authButton = new AuthButton(this.headerAction, !!this.user); // truyền header và user
    this.authButton.render(); // render

    this.authModal = new AuthModal(); // Tạo đối tượng modal login register

    this.init(); // Khởi tạo
  }

  async init() {
    await this.loadArtists(); // Load danh sách arstist
    await this.loadPopularTracks(); // Load danh sách nhạc phổ biến
    this.setUpEvent(); // Set event
  }

  setUpEvent() {
    const createBtn = document.querySelector(".create-btn"); // Lấy nút tạo play list
    const searchBtn = document.querySelector(".search-library-btn"); // lấy nút search để hỗ trợ search
    const inputSearch = document.querySelector(".search-library-input"); // lấy nút input để hỗ trợ nhập search
    const homeBtn = document.querySelector(".home-btn"); // Lấy nút home
    const signupBtn = this.headerAction.querySelector(".signup-btn"); // Lấy nút đăng kí
    const loginBtn = this.headerAction.querySelector(".login-btn"); // Lấy nút login
    const nabs = document.querySelectorAll(".nav-tab"); // Lấy tất cả navtabs để chia arsitst và playlist

    // Nếu chưa đăng nhập hoặc đăng kí thì sẽ có nút để get
    if (signupBtn && loginBtn) {
      signupBtn.onclick = () => {
        this.authModal.openWithSignup();
      };

      loginBtn.onclick = () => {
        this.authModal.openWithLogin();
      };
    }

    // Click khởi tạo làm content , và tracks
    homeBtn.addEventListener("click", () => {
      removeActiveClass(".library-item");
      this.contentWrapper.innerHTML = "";
      this.HomeComponent.render(this.library);
      this.HomeComponent.render(
        this.popularTracks,
        "Nhạc phổ biến hiện nay",
        "album"
      );
    });

    // Hàm lọc nghệ sĩ , và playlist
    nabs.forEach((nav) => {
      nav.onclick = (e) => {
        removeActiveClass(".nav-tab");
        e.target.closest(".nav-tab").classList.add("active");
        const contentNav = nav.textContent;
        console.log(contentNav);
        if (contentNav === "Artists") {
          this.loadArtistOld("Artist");
        } else {
          this.loadArtistOld("Playlists");
        }
      };
    });

    // Tạo 1 biến để lưu timer
    let debounceTimer;

    // Check sự thay đổi input
    inputSearch.addEventListener("input", (e) => {
      clearTimeout(debounceTimer); // Clean time out cũ mỗi khi input lại
      debounceTimer = setTimeout(() => {
        console.log(e.target.value);
        this.renderLibrary(this.library, undefined, e.target.value); // Render lại thư viện bên nav
      }, 800); // set độ trể của tìm kiếm 800ms
    });

    // Kiếm tra nếu có user và accessToken thì lấy ra playlist của tài khoản
    // Đăng nhập hoặc đã đk mới thấy
    if (this.user && this.accessToken) {
      createBtn.onclick = async () => {
        const response = await PlayListService.createPlayList(this.accessToken);
        this.playListEditComponent.createPlaylistPage(
          response.data.playlist.id,
          this.user.username,
          response.data.playlist.name
        );
      };
    }

    // Nút search hỗ trợ ui
    searchBtn.addEventListener("click", () => {
      inputSearch.style.visibility = "visible";
      inputSearch.style.opacity = "1";
      const textSort = document.querySelector(".text-sort");
      textSort.innerHTML = "";
    });

    // Hàm click ra ngoài tắt search input
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-library")) {
        inputSearch.style.visibility = "hidden";
        inputSearch.style.opacity = "0";
        inputSearch.value = "";

        const textSort = document.querySelector(".text-sort");
        textSort.innerHTML = this.sortDropdown.getCurrentSort;
      }
      // Hỡ trợ click ngoài tắt contextMenu
      this.contextMenuComponent.getMenu.classList.remove(MODAL_CLASSES.SHOW);
    });

    // 2 hàm bắt sụ kiện thay đổi khung nhìn và sắp xếp

    document.addEventListener("sortChanged", (e) => {
      this.handleSortChange(e.detail);
    });

    document.addEventListener("viewChanged", (e) => {
      this.handleViewChange(e.detail);
      this.detail = e.detail;
    });
  }

  //Hàm chọn nghệ sĩ , và playList
  async handleArtistSelect(id) {
    try {
      //Get id nếu phải id dạng playlist thì trả về component playlist
      const playList = await PlayListService.getPlayListById(id);
      if (playList.success) {
        const data = playList.data;
        this.playListComponent.createPlaylistPage(data.image_url, data.name);
        return;
      }
      const { artist, tracks } = await ArtistService.getArtistDetails(id);
      this.contentComponent.render(artist, tracks);
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
  }
  // Load Artist dùng chung cho cả home component có thể tuỳ biến việc render conponet
  // có thể sort riêng library nếu muốn mode = true
  async loadArtists(mode = false) {
    try {
      const response = await ArtistService.getArtists(); // Lấy artists

      if (response.success) {
        //  nếu lấy thành công
        const data = response.data.artists; // Lấy data artists
        let dataMyPlayList = [...data]; // Lưu trữ Data cùng nếu chưa có playList

        // Kiếm tra nếu đã đăng nhập
        if (this.user && this.accessToken) {
          const myPlayList = await PlayListService.getMyPlayList(
            this.accessToken
          );
          // Gắn dữ liệu đăng nhập có playlist vào
          dataMyPlayList = [...myPlayList.data.playlists, ...data];
        }
        this.library = data; // Gắn dữ liệu artist không có playList
        this.libraryDataMyPlayList = dataMyPlayList; // Gắn duex liệu có play list
        this.renderLibrary(this.libraryDataMyPlayList); //  Render từ đầu có playlist
        if (!mode) {
          // Hỗ trợ tải lại hàm nếu không render HomeComponet
          this.HomeComponent.render(data); // Render dữ liệu home
        }
      }
    } catch (error) {
      console.error("Lỗi lấy artists", error);
    }
  }

  // Hỗ trợ việc loadArtist không cần gọi lại api
  loadArtistOld(sortBy = "Playlists") {
    // Hỗ trợ sort gồm playlist có hoặc không
    this.renderLibrary(
      sortBy === "Playlists" ? this.libraryDataMyPlayList : this.library
    );
  }

  // Hàm LoadPopular
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

  // Hàm sort Arits
  sortArtists(artists, sortBy) {
    // Không có gì trả
    if (!sortBy || !sortBy.sortBy) return artists;

    const sorted = [...artists]; // Lấy mảng sorted

    // Kiếm tra detail sự kiện sortBy từ dispatch
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

  // Lọc Artist theo từ không in hoa
  filterArtists(artists, value) {
    if (!value) return;
    let sorted = [...artists];
    sorted = sorted.filter((sort) =>
      sort.name.toLowerCase().includes(value.toLowerCase())
    );

    return sorted;
  }

  // Tải thư viện có tích hợp sort (dùng để gọi lại mỗi lần sort)
  renderLibrary(libraries, sortBy, value) {
    if (sortBy) {
      console.log(sortBy);
      libraries = this.sortArtists(libraries, sortBy); // Có sortBy chứng tỏ đăng sort theo chữ
    }

    if (value) {
      libraries = this.filterArtists(libraries, value); // Sort value
    }

    this.libraryContent.innerHTML = ""; // Gắn lại xoá
    libraries.forEach((library) => {
      let modePlayList;
      if (library) {
        modePlayList = library.user_username; // Kiếm tra có user_name thì true truyền vào createItem để tạo
        // Libarary phù hợp với playlist
      }
      const libraryItem = this.libraryItemComponent.createLibraryItem(
        library.id,
        library.name,
        library.image_url,
        modePlayList
      );

      this.libraryContent.appendChild(libraryItem); // Thêm vào cuối
    });

    if (this.detail) {
      this.handleViewChange(this.detail);
    } // Sort theo khùng nhìn
  }

  handleSortChange(detail) {
    this.renderLibrary(this.library, detail);
  }

  // Sort theo khung nhìn
  handleViewChange(detail) {
    const libraryItems = document.querySelectorAll(".library-item");

    // Xoá tất cả kjimg mjomf
    libraryItems.forEach((item) => {
      item.classList.remove(
        "list-view",
        "compact-view",
        "grid-view",
        "grid-large-view"
      );
    });
    // Thay thế class
    const viewClass = `${detail.viewType}-view`;
    libraryItems.forEach((item) => {
      item.classList.add(viewClass);
    });
  }
}

export default HomePage;
