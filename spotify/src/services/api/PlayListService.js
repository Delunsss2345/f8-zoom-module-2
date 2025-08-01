import HttpRequest from "./HttpRequest.js";

class PlayListService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  async getMyPlayList(accessToken) {
    if (!accessToken) {
      return;
    }
    return await this.httpRequest.get(`/me/playlists`, accessToken);
  }

  async getPlayListById(id) {
    return await this.httpRequest.get(`/playlists/${id}`);
  }

  async createPlayList(accessToken) {
    if (!accessToken) {
      return;
    }
    const data = {
      name: "My New Playlist",
      description: "Playlist description",
      is_public: true,
      image_url: "https://example.com/playlist-cover.jpg",
    };
    return await this.httpRequest.post(`/playlists`, data, accessToken);
  }
}

export default new PlayListService();
