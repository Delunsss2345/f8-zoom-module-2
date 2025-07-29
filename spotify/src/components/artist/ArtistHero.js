import { formatNumber } from "../../utils/formatters.js";
import { createElement } from "../../utils/helpers.js";

class ArtistHero {
  constructor(container) {
    this.container = container;
  }
  createHeroSection(imageUrl, artistName, monthlyListeners) {
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

    const wrapper = createElement("div");
    wrapper.appendChild(heroBackground);
    wrapper.appendChild(heroContent);

    return wrapper;
  }

  render(artistData) {
    const { background_image_url, name, monthly_listeners } = artistData;

    this.container.innerHTML = "";
    this.container.appendChild(
      this.createHeroSection(background_image_url, name, monthly_listeners)
    );
  }
}

export default ArtistHero;
