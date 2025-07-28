import HttpRequest from "./utils/HttpRequest.js";

const libraryContent = document.querySelector(".library-content");
const artistHero = document.querySelector(".artist-hero");
const trackList = document.querySelector(".track-list");
// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", async function () {
  // Get DOM elements
  const signupBtn = document.querySelector(".signup-btn");
  const loginBtn = document.querySelector(".login-btn");
  const authModal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");

  // Function to show signup form
  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }

  // Function to show login form
  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }

  // Function to open modal
  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  // Open modal with Sign Up form when clicking Sign Up button
  signupBtn.addEventListener("click", function () {
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
    showLoginForm();
    openModal();
  });

  // Close modal function
  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking close button
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking overlay (outside modal container)
  authModal.addEventListener("click", function (e) {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && authModal.classList.contains("show")) {
      closeModal();
    }
  });

  // Switch to Login form
  showLoginBtn.addEventListener("click", function () {
    showLoginForm();
  });

  // Switch to Signup form
  showSignupBtn.addEventListener("click", function () {
    showSignupForm();
  });

  // User Menu Dropdown Functionality
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Handle logout button click
  logoutBtn.addEventListener("click", function () {
    // Close dropdown first
    userDropdown.classList.remove("show");

    console.log("Logout clicked");
    // TODO: Students will implement logout logic here
  });

  // Hàm lấy tên
  function createHeroSection(imageUrl, artistName, monthlyListeners) {
    const heroBackground = document.createElement("div");
    heroBackground.className = "hero-background";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `${artistName} artist background`;
    img.className = "hero-image";

    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";

    heroBackground.appendChild(img);
    heroBackground.appendChild(overlay);

    const heroContent = document.createElement("div");
    heroContent.className = "hero-content";

    const verified = document.createElement("div");
    verified.className = "verified-badge";
    verified.innerHTML = `<i class="fas fa-check-circle"></i><span>Verified Artist</span>`;

    const name = document.createElement("h1");
    name.className = "artist-name";
    name.textContent = artistName;

    const listeners = document.createElement("p");
    listeners.className = "monthly-listeners";
    const monthly = monthlyListeners.toLocaleString("vi-VN");
    listeners.textContent = `${monthly} monthly listeners`;

    heroContent.appendChild(verified);
    heroContent.appendChild(name);
    heroContent.appendChild(listeners);

    // Gộp tất cả lại
    const wrapper = document.createElement("div");
    wrapper.appendChild(heroBackground);
    wrapper.appendChild(heroContent);

    return wrapper;
  }

  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = (duration % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Hàm tạo trackItem
  function createTrackItem(id, number, imageUrl, trackName, plays, duration) {
    const container = document.createElement("div");
    container.className = "track-item";

    const numberDiv = document.createElement("div");
    numberDiv.className = "track-number";
    numberDiv.textContent = number;

    const imageDiv = document.createElement("div");
    imageDiv.className = "track-image";
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = trackName;
    imageDiv.appendChild(img);

    const infoDiv = document.createElement("div");
    infoDiv.className = "track-info";
    const nameDiv = document.createElement("div");
    nameDiv.className = "track-name";
    nameDiv.textContent = trackName;
    infoDiv.appendChild(nameDiv);

    const playsDiv = document.createElement("div");
    playsDiv.className = "track-plays";
    playsDiv.textContent = plays.toLocaleString("vi-VN");

    const durationDiv = document.createElement("div");
    durationDiv.className = "track-duration";
    durationDiv.textContent = formatDuration(duration);

    const menuBtn = document.createElement("button");
    menuBtn.className = "track-menu-btn";
    menuBtn.innerHTML = `<i class="fas fa-ellipsis-h"></i>`;

    container.appendChild(numberDiv);
    container.appendChild(imageDiv);
    container.appendChild(infoDiv);
    container.appendChild(playsDiv);
    container.appendChild(durationDiv);
    container.appendChild(menuBtn);

    return container;
  }

  // Hàm render trackList
  function renderTrack(albums) {
    albums.forEach((track, idx) => {
      trackList.appendChild(
        createTrackItem(
          track.id,
          idx + 1,
          track.image_url,
          track.title,
          track.play_count,
          track.duration
        )
      );
    });
  }
  function removeActiveArtist() {
    const lbItem = document.querySelectorAll(".library-item");
    lbItem.forEach((lb) => lb.classList.remove("active"));
  }

  async function getArtistById(id) {
    const [artistRes, albumsRes] = await Promise.all([
      HttpRequest.get(`/artists/${id}`),
      HttpRequest.get(`/artists/${id}/tracks/popular`),
    ]);
    console.log(artistRes, albumsRes.data.tracks);

    const { background_image_url, name, monthly_listeners } = artistRes.data;
    artistHero.innerHTML = "";
    artistHero.appendChild(
      createHeroSection(background_image_url, name, monthly_listeners)
    );

    trackList.innerHTML = "";
    renderTrack(albumsRes.data.tracks);
  }
  // Tạo artist item
  function createLibraryItem(id, title, imageUrl, idx) {
    const container = document.createElement("div");
    container.className = "library-item";

    container.onclick = (e) => {
      removeActiveArtist();
      getArtistById(id);
      e.currentTarget.classList.add("active");
    };

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.className = "item-image";

    const info = document.createElement("div");
    info.className = "item-info";

    const titleDiv = document.createElement("div");
    titleDiv.className = "item-title";
    titleDiv.textContent = title;

    const subtitleDiv = document.createElement("div");
    subtitleDiv.className = "item-subtitle";
    subtitleDiv.textContent = "Artist";

    info.appendChild(titleDiv);
    info.appendChild(subtitleDiv);
    container.appendChild(img);
    container.appendChild(info);
    if (idx === 0) {
      getArtistById(id);
      container.classList.add("active");
    }
    return container;
  }
  // Tải danh sách
  function renderLibrary(artists) {
    artists.forEach((artist, idx) => {
      libraryContent.appendChild(
        createLibraryItem(artist.id, artist.name, artist.image_url, idx)
      );
    });
  }

  // Other functionality
  const artists = await HttpRequest.get("/artists?limit=20&offset=0");
  renderLibrary(artists.data.artists);
});
