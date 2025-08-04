import PlayListService from "../../services/api/PlayListService.js";
import { createElement } from "../../utils/helpers.js";

class Playlist {
  constructor(container) {
    this.container = container;
    this.accessToken = localStorage.getItem("accessToken");
    this.init();
  }

  init() {
    this.setUpFollowing();
  }
  // Hàm khởi tạo danh sách đã follow
  async setUpFollowing() {
    const response = await PlayListService.getAllPlayListFollow(
      this.accessToken
    );
    this.playListFollowing = response.data.playlists;
  }

  // Hàm để theo dõi chi tiết
  async handlerFollow(e, id) {
    if (e.target.classList.contains("following")) {
      e.target.textContent = "Theo dõi";
      await PlayListService.unfollowPlaylist(this.accessToken, id);
    } else {
      e.target.textContent = "Đang theo dõi";
      await PlayListService.followPlaylist(this.accessToken, id);
    }
    e.target.classList.toggle("following");
    // Khởi tạo lại hàm đã follow
    this.setUpFollowing();
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
    const img = createElement("div", {
      className: "hero-image playlist-cover play-list-image-detail",
    });

    // Icon trái tim ở giữa ảnh
    const icon = createElement("i", {
      className: "fas fa-heart",
    });
    img.appendChild(icon);

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

    const followBtn = createElement("button", {
      className: "follow-btn",
      textContent: "Theo dõi",
    });
    if (id) {
      this.playListFollowing.forEach((el) => {
        if (el.id === id) {
          followBtn.classList.add("following");
          followBtn.textContent = "Đang theo dõi";
        }
      });
    }

    followBtn.onclick = (e) => {
      this.handlerFollow(e, id);
    };

    // Nút Play
    const playBtn = createElement("button", { className: "play-btn-large" });
    const playIcon = createElement("i", { className: "fas fa-play" });
    playBtn.appendChild(playIcon);
    artistControls.appendChild(playBtn);
    artistControls.appendChild(followBtn);

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
