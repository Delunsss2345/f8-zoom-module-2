import { formatDuration, formatNumber } from "../../utils/formatters.js";
import { createElement } from "../../utils/helpers.js";

class TrackList {
  constructor(container, audio, progress, player) {
    this.audio = audio;
    this.progress = progress;
    this.player = player;
    this.container = container;

    this.currentId = 0;
    this._tracks = [];
    this.queue = [];
    this.isPlaying = false;
    this.isRepeat = false;
    this.isShuffle = false;
  }

  init(tracks, artistName) {
    this.artistName = artistName;
    this._tracks = tracks;
    this.render(tracks);
    this.setupEventControl();
    this.setupClickToPlay();
  }

  setupEventControl() {
    const playBtn = document.querySelector(".control-btn.play-btn");
    const playBtnIcon = playBtn.querySelector(".fas");
    this.playBtnIcon = playBtnIcon;

    const prevBtn = document.querySelector(".control-btn.prev-btn");
    const nextBtn = document.querySelector(".control-btn.next-btn");
    const returnBtn = document.querySelector(".control-btn.return-btn");
    const shuffleBtn = document.querySelector(".control-btn.random-btn");

    playBtn.onclick = () => {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.isPlaying = true;
        this.playCurrentTrack();
      }
    };

    prevBtn.onclick = () => this.prevTrack();
    nextBtn.onclick = () => this.nextTrack();

    returnBtn.onclick = () => {
      this.isRepeat = !this.isRepeat;
      returnBtn.classList.toggle("active", this.isRepeat);
    };

    shuffleBtn.onclick = () => {
      this.isShuffle = !this.isShuffle;
      shuffleBtn.classList.toggle("active", this.isShuffle);
    };

    this.audio.onplay = () => {
      this.isPlaying = true;
      this.playBtnIcon.classList.remove("fa-play");
      this.playBtnIcon.classList.add("fa-pause");
    };

    this.audio.onpause = () => {
      this.isPlaying = false;
      this.playBtnIcon.classList.remove("fa-pause");
      this.playBtnIcon.classList.add("fa-play");
    };

    this.audio.ontimeupdate = () => {
      if (this.progress.seeking) return;
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progress.value = percent || 0;
    };

    this.progress.onmousedown = () => {
      this.progress.seeking = true;
    };

    this.progress.onmouseup = () => {
      const percent = +this.progress.value;
      this.audio.currentTime = (this.audio.duration / 100) * percent;
      this.progress.seeking = false;
    };

    this.audio.onended = () => {
      if (this.isRepeat) {
        this.audio.currentTime = 0;
        this.playCurrentTrack();
        return;
      }
      this.nextTrack();
    };
  }

  setupPlayer(track) {
    if (!this.player || !track) return;

    const playerLeft = this.player.querySelector(".player-left");
    const title = this.player.querySelector(".player-title");
    const artist = this.player.querySelector(".player-artist");

    const oldImage = playerLeft.querySelector(".player-image");
    if (oldImage) oldImage.remove();

    const image = createElement("img", {
      className: "player-image",
      attributes: {
        src: track.image_url
          ? `${track.image_url}?height=56&width=56`
          : "placeholder.svg?height=56&width=56",
        alt: track.title || "Unknown",
      },
    });

    playerLeft.prepend(image);

    if (title) title.textContent = track.title || "Unknown title";
    if (artist)
      artist.textContent =
        track.artist_name || this.artistName || "Unknown artist";
  }

  setupClickToPlay() {
    this.container.onclick = (e) => {
      e.stopPropagation();
      const item = e.target.closest(".track-item");
      if (!item) return;

      const id = item.getAttribute("data-id");
      const index = this._tracks.findIndex((t) => t.id === id);
      if (index !== -1) {
        console.log(index);
        this.currentId = index;
        this.isPlaying = true;
        this.playCurrentTrack();
      }
    };
  }

  playCurrentTrack() {
    if (this.currentId < 0 || this.currentId >= this._tracks.length) return;
    const track = this._tracks[this.currentId];
    this.setupPlayer(track);

    this.audio.onloadedmetadata = () => {
      if (this.isPlaying) {
        this.audio.play();
      }
    };

    this.audio.src = track.audio_url;

    document.querySelectorAll(".track-item").forEach((el) => {
      el.classList.remove("playing");
    });
    const active = this.container.querySelector(`[data-id='${track.id}']`);
    if (active) active.classList.add("playing");
  }

  prevTrack() {
    if (this._tracks.length === 0) return;

    if (this.isShuffle) {
      let newId;
      do {
        newId = Math.floor(Math.random() * this._tracks.length);
      } while (newId === this.currentId);
      this.currentId = newId;
    } else {
      this.currentId =
        (this.currentId - 1 + this._tracks.length) % this._tracks.length;
    }
    this.playCurrentTrack();
  }

  nextTrack() {
    if (this._tracks.length === 0) return;

    if (this.isShuffle) {
      let newId;
      do {
        newId = Math.floor(Math.random() * this._tracks.length);
      } while (newId === this.currentId);
      this.currentId = newId;
    } else {
      this.currentId = (this.currentId + 1) % this._tracks.length;
      console.log(this.currentId);
    }
    this.playCurrentTrack();
  }

  createTrackItem(id, number, imageUrl, trackName, plays, duration) {
    const container = createElement("div", {
      className: "track-item",
      attributes: { "data-id": id },
    });

    container.appendChild(
      createElement("div", {
        className: "track-number",
        textContent: number.toString(),
      })
    );

    const imageDiv = createElement("div", { className: "track-image" });
    const img = createElement("img", {
      attributes: { src: imageUrl, alt: trackName },
    });
    imageDiv.appendChild(img);
    container.appendChild(imageDiv);

    const infoDiv = createElement("div", { className: "track-info" });
    infoDiv.appendChild(
      createElement("div", { className: "track-name", textContent: trackName })
    );
    container.appendChild(infoDiv);

    container.appendChild(
      createElement("div", {
        className: "track-plays",
        textContent: formatNumber(plays),
      })
    );
    container.appendChild(
      createElement("div", {
        className: "track-duration",
        textContent: formatDuration(duration),
      })
    );
    container.appendChild(
      createElement("button", {
        className: "track-menu-btn",
        innerHTML: `<i class="fas fa-ellipsis-h"></i>`,
      })
    );

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

  get queueTracks() {
    return this.queue;
  }

  get tracks() {
    return this._tracks;
  }
}

export default TrackList;
