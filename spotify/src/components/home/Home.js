import ArtistService from "../../services/api/ArtistService.js";
import { createElement } from "../../utils/helpers.js";
import ArtistHero from "../artist/ArtistHero.js";

class Home {
  constructor(container) {
    this.container = container;
    this.contentWrapper = document.querySelector(".content-wrapper");
    this.contentComponent = new ArtistHero(this.contentWrapper);
  }
  async handleArtistHome(id) {
    try {
      const { artist, tracks } = await ArtistService.getArtistDetails(id);
      console.log(artist, tracks);
      this.contentComponent.render(artist, tracks);
    } catch (error) {
      console.error("Lỗi lấy artist details", error);
    }
  }
  render(data, title = "Nghệ sĩ yêu thích của bạn", mode = "artist") {
    const section = createElement("section", {
      className: "home",
    });

    // section.onclick = () => {
    //   this.handelArtist(data.id);
    // };

    console.log(data);
    const header = createElement("div", {
      className: "section-header",
      innerHTML: `
      <h2 class="home-title">${title}</h2>
      <a href="#" class="show-all">Hiện tất cả</a>
    `,
    });

    const contentGrid = createElement("div", {
      className: "content-grid",
    });

    data.forEach((item) => {
      const img = createElement("img", {
        className: mode === "artist" ? "artist-img" : "album-img",
        attributes: {
          src: item.image_url,
          alt: mode === "artist" ? item.name : item.artist_name,
        },
      });

      const figure = createElement("figure", {
        className: "content-img",
      });
      figure.appendChild(img);

      if (mode === "artist") {
        figure.onclick = () => {
          this.handleArtistHome(item.id);
        };
      }

      const title = createElement("div", {
        className: "content-title",
        textContent: mode === "artist" ? item.name : item.artist_name,
      });

      const subtitle = createElement("div", {
        className: "content-subtitle",
        textContent: mode === "artist" ? "Nghệ sĩ" : item.name,
      });

      const info = createElement("div", {
        className: "content-info",
      });
      info.appendChild(title);
      info.appendChild(subtitle);

      const card = createElement("div", {
        className: "content-card",
      });
      card.appendChild(figure);
      card.appendChild(info);

      contentGrid.appendChild(card);
    });

    section.appendChild(header);
    section.appendChild(contentGrid);

    this.container.appendChild(section);
  }
}

export default Home;
