import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";
import UploadService from "./UploadService.js";

class PlayListService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  //Get playlist following
  async getAllPlayListFollow(accessToken) {
    return await this.httpRequest.get(`/me/playlists/followed`, accessToken);
  }

  ///playlists?limit=20&offset=0
  async getAllPlayList(limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET) {
    return await this.httpRequest.get(
      `/playlists?limit=${limit}&offset=${offset}`
    );
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
    if (!accessToken) {
      return;
    }
    const playListId = data.id;
    let img_url;
    if (data.image) {
      img_url = await UploadService.uploadImagePLayList(
        accessToken,
        playListId,
        data.image
      );

      console.log(img_url) ; 
    }
    const playListEdit = {
      name: data.name,
      description: data.description,
      is_public: true,
      image_url: img_url,
    };

    const response = await this.httpRequest.put(
      `/playlists/${playListId}`,
      playListEdit,
      accessToken
    );

    return response;
  }

  //Follow playlist
  async followPlaylist(accessToken, playlistId) {
    if (!accessToken) {
      return;
    }
    const response = await this.httpRequest.post(
      `/playlists/${playlistId}/follow`,
      null,
      accessToken
    );

    return response;
  }

  //Unfollow playlist
  async unfollowPlaylist(accessToken, playlistId) {
    if (!accessToken) {
      return;
    }

    const response = await this.httpRequest.del(
      `/playlists/${playlistId}/follow`,
      null,
      accessToken
    );

    return response;
  }
}

export default new PlayListService();
