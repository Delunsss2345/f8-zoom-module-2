import HttpRequest from "./HttpRequest.js";

class PlayListService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  // getPlayList auth
  async getMyPlayList(accessToken) {
    if (!accessToken) {
      return;
    }
    return await this.httpRequest.get(`/me/playlists`, accessToken);
  }

  // getPlayList by id
  async getPlayListById(id) {
    return await this.httpRequest.get(`/playlists/${id}`);
  }

  // create Play List
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
  async uploadPlayList(accessToken, data) {
    console.log(accessToken, data);
    if (!accessToken) {
      return;
    }
    const playListId = data.id;
    const playListEdit = {
      name: data.name,
      description: data.description,
      is_public: true,
    };

    console.log({ playListEdit, playListId });
    const response = await this.httpRequest.put(
      `/playlists/${playListId}`,
      playListEdit,
      accessToken
    );

    return response;
  }
}

export default new PlayListService();
