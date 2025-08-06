import ArtistService from "../../services/api/ArtistService.js";
import PlayListService from "../../services/api/PlayListService.js";
import UserService from "../../services/api/UserService.js";
import { MODAL_CLASSES } from "../../utils/constants.js";

class ContextMenu {
  constructor() {
    this.menu = null;
    this.currentBtn = null;
    this.currentId = null;
    this.myPlaylistFollowing = [];
    this.accessToken = localStorage.getItem("accessToken"); // Gán accessToken TRƯỚC
  }

  async init() {
    await this.createContextMenu();
    this.setupEvents();
  }

  async initFollowing() {
    const response = await UserService.getFollowing(this.accessToken);
    this.myPlaylistFollowing = response.data.playlists;
  }

  async createContextMenu() {
    this.menu = document.createElement("div");
    this.menu.className = "context-menu";
    document.body.appendChild(this.menu);

    await this.initFollowing(); // Gọi sau khi accessToken đã có
    console.log(this.myPlaylistFollowing);

    // Gắn sự kiện click menu 1 lần duy nhất
    this.menu.addEventListener("click", async (e) => {
      const item = e.target.closest(".context-menu-item");
      if (!item) return;

      const action = item.dataset.action;
      const id = item.dataset.id;
      const libraryItem = document.querySelector(
        `.library-item[data-id="${id}"]`
      );

      try {
        switch (action) {
          case "unfollow-playlist":
            if (libraryItem) libraryItem.remove();
            await PlayListService.unfollowPlaylist(this.accessToken, id);

            break;

          case "delete-playlist":
            if (libraryItem) libraryItem.remove();
            await PlayListService.delPlayList(this.accessToken, id);
            break;

          case "unfollow-artist":
            if (libraryItem) libraryItem.remove();
            await ArtistService.unfollowArtist(this.accessToken, id);
            break;
        }
      } catch (err) {
        console.error("Action failed:", err);
      }

      this.menu.classList.remove(MODAL_CLASSES.SHOW); // Ẩn menu sau khi thao tác
    });
  }

  setupEvents() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      const item = e.target.closest(".library-item");
      if (!item) {
        this.menu.classList.remove(MODAL_CLASSES.SHOW);
        return;
      }

      const id = item.dataset.id;
      const isPlaylist = !!e.target.closest(".play-liked");
      const isFollowing = this.myPlaylistFollowing.some(
        (play) => play.id === id
      );

      let menuHTML = "";

      if (isPlaylist) {
        menuHTML = `
          ${
            isFollowing
              ? `
            <div class="context-menu-item" data-action="unfollow-playlist" data-id="${id}">
              <i class="fas fa-user-minus"></i> Bỏ theo dõi
            </div>
          `
              : `
            <div class="context-menu-item" data-action="delete-playlist" data-id="${id}">
              <i class="fas fa-trash"></i> Xoá
            </div>
          `
          }
        `;
      } else {
        menuHTML = `
          <div class="context-menu-item" data-action="unfollow-artist" data-id="${id}">
            <i class="fas fa-times"></i> Hủy theo dõi
          </div>
        `;
      }

      this.menu.innerHTML = menuHTML;
      this.menu.style.top = `${e.pageY}px`;
      this.menu.style.left = `${e.pageX}px`;
      this.menu.classList.add(MODAL_CLASSES.SHOW);
    });

    // Ẩn menu nếu click ra ngoài
    document.addEventListener("click", () => {
      this.menu.classList.remove(MODAL_CLASSES.SHOW);
    });
  }

  get getMenu() {
    return this.menu;
  }
}

export default ContextMenu;
