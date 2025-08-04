import ArtistService from "../../services/api/ArtistService.js";
import PlayListService from "../../services/api/PlayListService.js";
import { createElement } from "../../utils/helpers.js";
import ArtistHero from "../artist/ArtistHero.js";
import Playlist from "../playlist/PLayList.js";

class Home {
  constructor(container) {
    this.container = container;
    this.contentWrapper = document.querySelector(".content-wrapper");
    this.contentComponent = new ArtistHero(this.contentWrapper);
    this.playListComponent = new Playlist(this.contentWrapper);
  }
  // Chi tiết click Artists ở home
  async handleArtistHome(id) {
    try {
      const { artist, tracks } = await ArtistService.getArtistDetails(id);
      console.log(artist, tracks);
      this.contentComponent.render(artist, tracks);
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
  }

  async handlerPlayHome(id) {
    try {
      const response = await PlayListService.getPlayListById(id);
      const playlist = response.data;
      this.playListComponent.createPlaylistPage(
        playlist.image_url,
        playlist.name , 
        playlist.id
      );
    } catch (error) {
      console.error("Lỗi lấy playlist details", error);
    }
  }

  render(data, title = "Nghệ sĩ yêu thích của bạn", mode = "artist") {
    // Tạo thẻ <section> để chứa toàn bộ nội dung
    const section = createElement("section", {
      className: "home",
    });

    console.log(data);

    // Tạo phần tiêu đề (header) của section, bao gồm tiêu đề và nút "Hiện tất cả"
    const header = createElement("div", {
      className: "section-header",
      innerHTML: `
      <h2 class="home-title">${title}</h2>
      <a href="#" class="show-all">Hiện tất cả</a>
    `,
    });

    // Tạo phần chứa các card nội dung (dạng lưới)
    const contentGrid = createElement("div", {
      className: "content-grid",
    });

    // Duyệt qua từng phần tử trong mảng
    let img;
    data.forEach((item) => {
      if (mode === "playlist") {
        if (
          !item.image_url ||
          item.image_url === "https://example.com/playlist-cover.jpg"
        ) {
          img = createElement("div", {
            className: "album-img playlist-cover play-list-image ",
          });

          // Icon trái tim ở giữa ảnh
          const icon = createElement("i", {
            className: "fas fa-heart",
          });
          img.appendChild(icon);
        }
      } else {
        // Tạo ảnh đại diện của artist hoặc album, hoặc playlist
        img = createElement("img", {
          className: mode === "artist" ? "artist-img" : "album-img",
          attributes: {
            src: item.image_url,
            alt: mode === "artist" ? item.name : item.artist_name,
          },
        });
      }
      const figure = createElement("figure", {
        className: "content-img",
      });
      figure.appendChild(img);
      // Nếu là nghệ sĩ, gắn sự kiện click để mở trang chi tiết nghệ sĩ
      if (mode === "artist") {
        figure.onclick = () => {
          this.handleArtistHome(item.id);
        };
      } else if (mode === "playlist") {
        figure.onclick = () => {
          this.handlerPlayHome(item.id);
        };
      }

      //  Tên nghệ sĩ hoặc tên album
      const title = createElement("div", {
        className: "content-title",
        textContent: mode === "artist" ? item.name : item.artist_name,
      });

      // "Nghệ sĩ" nếu là mode artist, còn không thì là tên album
      const subtitle = createElement("div", {
        className: "content-subtitle",
        textContent: mode === "artist" ? "Nghệ sĩ" : item.name,
      });

      // Bọc tiêu đề và phụ đề lại trong 1 khối info
      const info = createElement("div", {
        className: "content-info",
      });
      info.appendChild(title);
      info.appendChild(subtitle);

      // Gộp phần ảnh và info thành 1 card
      const card = createElement("div", {
        className: "content-card",
      });
      card.appendChild(figure);
      card.appendChild(info);

      // Thêm card vào lưới
      contentGrid.appendChild(card);
    });

    // Thêm phần header và lưới nội dung vào section
    section.appendChild(header);
    section.appendChild(contentGrid);

    // Thêm section vào container chính
    this.container.appendChild(section);
  }
}

export default Home;
