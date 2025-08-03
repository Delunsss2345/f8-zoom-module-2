import PlayListService from "../../services/api/PlayListService.js";
import { createElement } from "../../utils/helpers.js";
import ArtistHero from "../artist/ArtistHero.js";
import LibraryItem from "../library/LibraryItem.js";
import ModelEditPlayList from "./ModalEditPlayList.js";
import Playlist from "./PLayList.js";

class PlaylistEdit {
  constructor(container) {
    this.container = container;
    this.contentComponent = new ArtistHero(this.container);
    this.playListComponent = new Playlist(this.container);

    this.editPlayList = new ModelEditPlayList();
    this.accessToken = localStorage.getItem("accessToken");
    this.libraryContent = document.querySelector(".library-content"); // Lấy content
    // Mỗi khi edit sẽ tạo mới một library dạng playlist nên sẽ không có sự kiện click
    // Hàm này để gắn sự kiện click cho cái mới tạo
    // Ơ HomePage cũng có để hỗ trợ cho tất cả lib được render ra
    this.libraryItemComponent = new LibraryItem((id) => {
      this.playListId = id;
      this.handlePlayList(id);
    });
  }

  // Hàm hỗ trợ click vào playlist
  async handlePlayList(id) {
    try {
      const playList = await PlayListService.getPlayListById(id);
      const data = playList.data;

      this.playListComponent.createPlaylistPage(data.image_url, data.name);
    } catch (error) {
      console.error("Lỗi lấy playListDetails details", error);
    }
  }
  // Hàm tạo playlist page
  createPlaylistPage(id, username, playlistName) {
    // Xóa toàn bộ nội dung trong container
    this.container.innerHTML = "";

    // Tạo section hiển thị ảnh và thông tin playlist
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

    // Box chứa ảnh playlist (chưa có ảnh nên hiển thị khung trống + nút chọn ảnh)
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

    // Icon chỉnh sửa (bút chì) hiển thị trên góc phải ảnh
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

    // Text "Chọn ảnh" tiếng Việt
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

    // Text "Choose photo" tiếng Anh
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

    // Gắn icon và text vào box ảnh
    imageBox.appendChild(pencilIcon);
    imageBox.appendChild(chooseTextVN);
    imageBox.appendChild(chooseTextEN);

    // Gán sự kiện khi click vào box ảnh để mở form chỉnh sửa playlist
    imageBox.onclick = () => {
      this.editPlayList.render({
        playlistName: `${playlistName}`,
        playlistDescription: "Playlist description",
        playlistImage: null,
        onSave: async (data) => {
          data.id = id;
          console.log(data);
          const response = await PlayListService.uploadPlayList(
            this.accessToken,
            data
          );
          console.log(response);

          // Tạo playlist mới và hiển thị trong thư viện
          const newPlayList = response.data.playlist;
          const playList = this.libraryItemComponent.createLibraryItem(
            newPlayList.id,
            newPlayList.name,
            null,
            true
          );
          this.libraryContent.prepend(playList);

          // Quay về trang Home sau khi lưu xong
          const home = document.querySelector(".home-btn");
          home.click();
        },
      });
    };

    // Box chứa thông tin về playlist (tên, chủ sở hữu)
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

    // Label thể hiện playlist là công khai
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

    // Tiêu đề chính: tên playlist
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

    // Hiển thị tên người tạo playlist (viết hoa chữ cái đầu)
    const userUp = username.charAt(0).toUpperCase() + username.slice(1);
    const author = createElement("div", {
      textContent: `${userUp} • `,
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

    // Gắn box ảnh và box thông tin vào phần hero
    artistHero.appendChild(imageBox);
    artistHero.appendChild(infoBox);

    // Section chứa các nút điều khiển: play, list
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

    // Nút Play lớn
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

    // Icon play
    const playIcon = createElement("i", {
      className: "fas fa-play",
      attributes: {
        style: "margin-left: 2px;",
      },
    });
    playBtn.appendChild(playIcon);

    // Nút List (danh sách bài hát)
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

    // Section tìm kiếm bài hát để thêm vào playlist
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

    // Box input tìm kiếm
    const searchInputContainer = createElement("div", {
      attributes: {
        style: `
        position: relative;
        max-width: 400px;
      `,
      },
    });

    // Icon kính lúp tìm kiếm
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

    // Input search
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

    // Gắn icon và input vào container
    searchInputContainer.appendChild(searchIcon);
    searchInputContainer.appendChild(searchInput);

    // Gắn tiêu đề và khung tìm kiếm vào section
    searchSection.appendChild(searchTitle);
    searchSection.appendChild(searchInputContainer);

    // Gắn tất cả phần tử chính vào container
    this.container.appendChild(artistHero);
    this.container.appendChild(controlsSection);
    this.container.appendChild(searchSection);
  }
}

export default PlaylistEdit;
