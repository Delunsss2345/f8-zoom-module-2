import PlayListService from "../../services/api/PlayListService.js";
import {
  createElement,
  handlerFollow,
  handleSelect,
} from "../../utils/helpers.js";
import LibraryItem from "../library/LibraryItem.js";

class Playlist {
  constructor(
    container,
    setLibraryFull,
    getLibraryFull,
    getLibraryPlaylist,
    setLibraryPlaylist
  ) {
    this.setLibraryNow = setLibraryFull; // set  hàm chứa tất cả  hiện tại
    this.getLibraryNow = getLibraryFull; // get hàm chứa tất cả  hiện tại
    this.setLibraryPlaylistNow = setLibraryPlaylist; // set hàm chứa playlist hiện tại
    this.getLibraryPlaylistNow = getLibraryPlaylist; // get hàm chứa playlist hiện tại
    this.container = container;
    this.accessToken = localStorage.getItem("accessToken");

    this.libraryItemComponent = new LibraryItem((id) => {
      this.artistId = id;
      handleSelect(id, this.accessToken, this, "playlist");
    });
    this.init();
  }

  async init() {
    this.setUpFollowing();
    const response = await PlayListService.getMyPlayList(this.accessToken);
    this.myPlayList = response.data.playlists.map((playlist) => playlist.id);
  }
  // Hàm khởi tạo danh sách đã follow, vì khi theo dõi, nếu không tạo lại hàm này
  // sẽ khiến playlist mới được thêm vào nav nhưng không hiện theo dõi
  async setUpFollowing(accessToken) {
    const response = await PlayListService.getAllPlayListFollow(
      accessToken || this.accessToken
    );
    this.playListFollowing = response.data.playlists;
  }

  createPlaylistPage(imageUrl, playlistName, id = null) {
    // Xóa nội dung cũ trong container
    this.container.innerHTML = "";

    // Tạo wrapper chứa toàn bộ nội dung
    const contentWrapper = createElement("div", {
      className: "content-wrapper",
    });

    // Tạo section hero chứa ảnh và thông tin playlist
    const artistHero = createElement("section", { className: "artist-hero" });

    // Tạo phần nền cho hero
    const heroBackground = createElement("div", {
      className: "hero-background",
    });

    // Container cho ảnh playlist nằm dưới góc trái
    const playlistImageContainer = createElement("div", {
      className: "playlist-image-container",
    });

    // Ảnh playlist được thể hiện bằng div có icon trái tim ở giữa
    let img;

    let image;
    if (!imageUrl || imageUrl === "https://example.com/playlist-cover.jpg") {
      img = createElement("div", {
        className: "hero-image playlist-cover play-list-image-detail",
      });
      const icon = createElement("i", {
        className: "fas fa-heart",
      });
      img.appendChild(icon);
    } else {
      img = createElement("figure", {
        className: "playlist-cover play-list-image-detail",
      });
      image = createElement("img", {
        className: "play-list-image-cover",
        attributes: {
          src: imageUrl,
          alt: playlistName,
        },
      });
      img.appendChild(image);
    }

    playlistImageContainer.appendChild(img);

    // Tạo lớp overlay mờ phía trên background
    const overlay = createElement("div", {
      className: "hero-overlay play-list-detail-overlay",
    });

    // Gắn overlay và ảnh vào background
    heroBackground.appendChild(overlay);
    heroBackground.appendChild(playlistImageContainer);

    // Nội dung phần hero: tiêu đề và label
    const heroContent = createElement("div", {
      className: "hero-content play-list-detail_heading",
    });

    // Nhãn "Playlist"
    const playlistLabel = createElement("span", {
      className: "playlist-label",
      textContent: "Playlist",
    });

    // Tên playlist
    const name = createElement("h1", {
      className: "play-list-detail_name ",
      textContent: playlistName,
    });

    // Gắn label và tên vào hero content
    heroContent.appendChild(name);
    heroContent.appendChild(playlistLabel);

    // Gắn background và content vào hero
    artistHero.appendChild(heroBackground);
    artistHero.appendChild(heroContent);

    // Section chứa các nút điều khiển như Play
    const artistControls = createElement("section", {
      className: "artist-controls",
    });

    // Nút Play
    const playBtn = createElement("button", { className: "play-btn-large" });
    const playIcon = createElement("i", { className: "fas fa-play" });
    playBtn.appendChild(playIcon);
    artistControls.appendChild(playBtn);

    if (!this.myPlayList || !this.myPlayList.includes(id)) {
      const followBtn = createElement("button", {
        className: "follow-btn",
        textContent: "Theo dõi",
      });
      if (id && this.myPlayList) {
        this.playListFollowing.forEach((el) => {
          if (el.id === id) {
            followBtn.classList.add("following");
            followBtn.textContent = "Đang theo dõi";
          }
        });
        console.log(id);
        followBtn.onclick = (e) => {
          handlerFollow(
            e,
            id,
            this.accessToken,
            this.getLibraryNow,
            this.setLibraryNow,
            this.getLibraryPlaylistNow,
            this.setLibraryPlaylistNow,
            this.libraryItemComponent,
            (token) => this.setUpFollowing(token),
            "playlist"
          );
        };
      }

      artistControls.appendChild(followBtn);
    }

    // Section sẽ hiển thị danh sách bài hát phổ biến trong playlist
    const popularSection = createElement("section", {
      className: "popular-section",
    });

    // Gắn các section con vào wrapper
    contentWrapper.appendChild(artistHero);
    contentWrapper.appendChild(artistControls);
    contentWrapper.appendChild(popularSection);

    // Gắn wrapper vào container chính
    this.container.appendChild(contentWrapper);
  }
}

export default Playlist;
