import { createElement } from "../../utils/helpers.js";

export default class Tooltip {
  constructor() {
    this.playerCenter = document.querySelector(".player-center");
    this.playerRight = document.querySelector(".player-right");
  }

  render() {
    const controls = [
      {
        class: "random-btn",
        icon: "fas fa-random",
        tooltip: "Phát ngẫu nhiên",
      },
      {
        class: "prev-btn",
        icon: "fas fa-step-backward",
        tooltip: "Trước",
      },
      {
        class: "play-btn",
        icon: "fas fa-play",
        tooltip: "Phát",
      },
      {
        class: "next-btn",
        icon: "fas fa-step-forward",
        tooltip: "Tiếp",
      },
      {
        class: "return-btn",
        icon: "fas fa-redo",
        tooltip: "Lặp lại",
      },
    ];

    const controlsWrapper = createElement("div", {
      className: "player-controls",
    });

    controls.forEach((control) => {
      const button = createElement("button", {
        className: `control-btn ${control.class} tooltip`,
      });

      const icon = createElement("i", { className: control.icon });
      const tooltip = createElement("span", {
        className: "tooltip-text",
        textContent: control.tooltip,
      });

      button.appendChild(icon);
      button.appendChild(tooltip);
      controlsWrapper.appendChild(button);
    });

    this.playerCenter.prepend(controlsWrapper);

    const micBtn = createElement("button", {
      className: "control-btn tooltip",
    });

    micBtn.appendChild(createElement("i", { className: "fas fa-microphone" }));
    micBtn.appendChild(
      createElement("span", {
        className: "tooltip-text",
        textContent: "Lời bài hát",
      })
    );

    const volumeContainer = createElement("div", {
      className: "volume-container tooltip",
    });

    const volumeBtn = createElement("button", {
      className: "control-btn",
    });
    volumeBtn.appendChild(
      createElement("i", { className: "fas fa-volume-down" })
    );

    const volumeBar = createElement("div", { className: "volume-bar" });
    const volumeFill = createElement("div", {
      className: "volume-fill",
      attributes: { style: "width: 20%" },
    });
    const volumeHandle = createElement("div", {
      className: "volume-handle",
    });

    volumeBar.appendChild(volumeFill);
    volumeBar.appendChild(volumeHandle);

    volumeContainer.appendChild(volumeBtn);
    volumeContainer.appendChild(volumeBar);
    volumeContainer.appendChild(
      createElement("span", {
        className: "tooltip-text",
        textContent: "Âm lượng",
      })
    );

    const fullscreenBtn = createElement("button", {
      className: "control-btn tooltip",
    });
    fullscreenBtn.appendChild(
      createElement("i", { className: "fas fa-expand" })
    );
    fullscreenBtn.appendChild(
      createElement("span", {
        className: "tooltip-text",
        textContent: "Toàn màn hình",
      })
    );
    // Thanh tiến độ kiểu input range nhưng giữ nguyên class
    const progressContainer = createElement("div", {
      className: "progress-container",
    });

    const currentTime = createElement("span", {
      className: "current-time",
      textContent: "0:00",
    });

    const progressInput = createElement("input", {
      className: "progress-bar", // giữ nguyên tên class cũ
      attributes: {
        type: "range",
        min: "0",
        max: "100",
        value: "0",
        step: "0.1",
      },
    });

    const progressFill = createElement("div", {
      className: "progress-fill",
    });

    const progressHandle = createElement("div", {
      className: "progress-handle",
    });

    const durationTime = createElement("span", {
      className: "duration-time",
      textContent: "0:00",
    });

    progressContainer.appendChild(currentTime);
    progressContainer.appendChild(progressInput);
    progressContainer.appendChild(progressFill);
    progressContainer.appendChild(progressHandle);
    progressContainer.appendChild(durationTime);

    this.playerCenter.appendChild(progressContainer);
    this.playerRight.appendChild(micBtn);
    this.playerRight.appendChild(volumeContainer);
    this.playerRight.appendChild(fullscreenBtn);
  }
}
