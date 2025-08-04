import { API_BASE_URL } from "../../utils/constants.js";
import { DataURIToBlob } from "../../utils/helpers.js";
import HttpRequest from "./HttpRequest.js";

class UploadService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  async uploadImagePLayList(accessToken, playlistId, cover) {
    if (!accessToken) return;

    const formData = new FormData();

    const blob = DataURIToBlob(cover);
    formData.append("cover", blob, "cover.jpg");

    const response = await fetch(
      `${API_BASE_URL}/upload/playlist/${playlistId}/cover`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    const json = await response.json();
    console.log(json);

    const img_url = `https://spotify.f8team.dev${json.file.url}`;
    return img_url;
  }
}

export default new UploadService();
