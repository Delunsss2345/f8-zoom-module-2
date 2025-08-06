import ArtistService from "../services/api/ArtistService.js";
import PlayListService from "../services/api/PlayListService.js";

//Xóa class "active" khỏi tất cả elements matching selector
export function removeActiveClass(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => element.classList.remove("active"));
}

// Bật/tắt scroll của body (dùng khi mở, đóng modal)
// Ngăn user scroll page khi modal đang mở
export function toggleBodyScroll(disable) {
  document.body.style.overflow = disable ? "hidden" : "auto";
}

// Tạo elements động
// Tạo DOM element với các options linh hoạt
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  // attributes format: {attributes : {alt : "huy", src: "image.jpg"}}
  // sẽ được convert thành array: [['alt', 'huy'], ['src', 'image.jpg']]
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}
// nguồn https://stackoverflow.com/questions/26667820/upload-a-base64-encoded-image-using-formdata
// Hàm chuyển base64 thành url
export function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ia], { type: mimeString });

  console.log({
    size: blob.size,
    type: blob.type,
    sizeInMB: (blob.size / 1024 / 1024).toFixed(2) + " MB",
  });

  return blob;
}

// Hàm tách để tái sự dụng amition cho modal
export function modalAnimationHelper(
  key,
  modalContainer,
  overLay,
  closeCallback
) {
  if (key === "open") {
    overLay.style.animation = "fadeIn 0.2s ease";
    modalContainer.style.animation = "modalSlideIn 0.2s ease";
  } else if (key === "close") {
    modalContainer.style.animation = "modalSlideOut 0.2s ease";
    overLay.style.animation = "fadeOut 0.2s ease";

    const handleAnimationEnd = () => {
      modalContainer.removeEventListener("animationend", handleAnimationEnd);
      overLay.style.animation = "";
      if (typeof closeCallback === "function") {
        closeCallback();
      }
    };

    modalContainer.addEventListener("animationend", handleAnimationEnd);
  }
}

// Hàm cập nhập state library artist và playlist
export function updateLibraryState(mode, item, getFn, setFn) {
  if (!getFn || !setFn) return;
  const currentList = getFn();
  const updatedList =
    mode === "delete"
      ? currentList.filter((el) => el.id !== item.id) // mode xoá xoá hàm lọc bên homepage
      : [...currentList, item]; // mode add thêm artist mới
  setFn(updatedList);
}

// Hàm handleFollow hỗ trợ follow ở 2 bên khác nhau playlist và artist
// vì khi tạo ra 1 library mới add ngay vào sideBar sẽ không gắn được sự kiện click nên phải tạo riêng
export async function handlerFollow(
  e,
  id,
  accessToken,
  getLibraryNow,
  setLibraryNow,
  getLibraryArtistOrPlayListNow,
  setLibraryArtistOrPlayListNow,
  libraryItemComponent,
  setUpFollowing,
  mode = "artist"
) {
  const isFollowing = e.target.classList.contains("following");
  e.target.textContent = isFollowing ? "Theo dõi" : "Đang theo dõi";
  e.target.classList.toggle("following");

  if (isFollowing) {
    document.querySelector(`.library-item[data-id="${id}"]`)?.remove();
    if (mode === "playlist") {
      await PlayListService.unfollowPlaylist(accessToken, id);
    } else {
      await ArtistService.unfollowArtist(accessToken, id);
    }

    updateLibraryState("delete", { id }, getLibraryNow, setLibraryNow);
    updateLibraryState(
      "delete",
      { id },
      getLibraryArtistOrPlayListNow,
      setLibraryArtistOrPlayListNow
    );
  } else {
    let data;
    // hỗ trợ mode khác nhau , nếu là playlist sẽ get playlist
    if (mode === "playlist") {
      const [_, res] = await Promise.all([
        PlayListService.followPlaylist(accessToken, id),
        PlayListService.getPlayListById(id),
      ]);
      data = res.data;
      setUpFollowing(accessToken);
      libraryItemComponent.createLibraryItem(
        data.id,
        data.name,
        data.image_url,
        true,
        true
      );
    } else {
      const [_, res] = await Promise.all([
        ArtistService.followArtist(accessToken, id),
        ArtistService.getArtistById(id),
      ]);

      data = res.data;

      libraryItemComponent.createLibraryItem(
        data.id,
        data.name,
        data.image_url,
        false,
        true
      );
    }

    updateLibraryState("add", data, getLibraryNow, setLibraryNow);
    updateLibraryState(
      "add",
      data,
      getLibraryArtistOrPlayListNow,
      setLibraryArtistOrPlayListNow
    );
  }
}

export async function handleSelect(
  id,
  accessToken,
  thisComponent,
  mode = "artist"
) {
  try {
    let data;
    switch (mode) {
      case "artist":
        data = await ArtistService.getArtistDetails(id, accessToken);
        thisComponent.render(
          data.artist,
          data.tracks,
          data.artist.id,
          data.artist.is_following
        );
        break;

      case "playlist":
        const response = await PlayListService.getPlayListById(id);
        data = response.data;
        thisComponent.createPlaylistPage(data.image_url, data.name, data.id);
        break;
    }
  } catch (error) {
    console.error(`Lỗi lấy ${mode} details`, error);
  }
}
