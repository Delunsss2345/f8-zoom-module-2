import HttpRequest from "./HttpRequest.js";

class UploadService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  async uploadImagePLayList(accessToken, playlistId, cover) {
    if (accessToken) {
      return;
    }

    const response = this.httpRequest.post(
      `/upload/playlist/${playlistId}/cover`,
      {
        cover,
      }
    );
  }
}

export default new PlayListService();
