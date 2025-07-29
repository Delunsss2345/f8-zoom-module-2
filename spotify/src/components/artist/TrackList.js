import { formatDuration, formatNumber } from "../../utils/formatters.js";
import { createElement } from "../../utils/helpers.js";

class TrackList {
  constructor(container) {
    this.container = container;
  }
  createTrackItem(id, number, imageUrl, trackName, plays, duration) {
    const container = createElement("div", { className: "track-item" });

    const numberDiv = createElement("div", {
      className: "track-number",
      textContent: number.toString(),
    });

    const imageDiv = createElement("div", { className: "track-image" });
    const img = createElement("img", {
      attributes: {
        src: imageUrl,
        alt: trackName,
      },
    });
    imageDiv.appendChild(img);

    const infoDiv = createElement("div", { className: "track-info" });
    const nameDiv = createElement("div", {
      className: "track-name",
      textContent: trackName,
    });
    infoDiv.appendChild(nameDiv);

    const playsDiv = createElement("div", {
      className: "track-plays",
      textContent: formatNumber(plays),
    });

    const durationDiv = createElement("div", {
      className: "track-duration",
      textContent: formatDuration(duration),
    });

    const menuBtn = createElement("button", {
      className: "track-menu-btn",
      innerHTML: `<i class="fas fa-ellipsis-h"></i>`,
    });

    container.appendChild(numberDiv);
    container.appendChild(imageDiv);
    container.appendChild(infoDiv);
    container.appendChild(playsDiv);
    container.appendChild(durationDiv);
    container.appendChild(menuBtn);

    return container;
  }

  render(tracks) {
    this.container.innerHTML = "";

    tracks.forEach((track, idx) => {
      const trackItem = this.createTrackItem(
        track.id,
        idx + 1,
        track.image_url,
        track.title,
        track.play_count,
        track.duration
      );

      this.container.appendChild(trackItem);
    });
  }
}

export default TrackList;
