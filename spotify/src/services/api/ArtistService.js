import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";

class ArtistService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  // /artists?limit=20&offset=0
  async getArtists(
    accessToken,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET
  ) {
    return await this.httpRequest.get(
      `/artists?limit=${limit}&offset=${offset}`,
      accessToken
    );
  }

  async getArtistsFollow(
    accessToken,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET
  ) {
    const response = await this.httpRequest.get(
      `/artists?limit=${limit}&offset=${offset}`
    );

    const data = response.data.artists;
    let dataFollow = [];
    for (const item of data) {
      let artist = await this.getArtistById(item.id, accessToken);
      if (artist.data.is_following) {
        dataFollow.push(artist.data);
      }
    }

    return { success: true, data: { artists: dataFollow, artistFull: data } };
  }

  // Lấy thông tin chi tiết của 1 artist theo ID
  // /artists/:artistId
  async getArtistById(id, accessToken = null) {
    return await this.httpRequest.get(`/artists/${id}`, accessToken);
  }

  // Lấy danh sách tracks phổ biến nhất của artist
  // /artists/:artistId/tracks/popular
  async getArtistPopularTracks(id) {
    return await this.httpRequest.get(`/artists/${id}/tracks/popular`);
  }

  // Follow một artist (cần authentication)
  // POST /artists/:artistId/follow
  async followArtist(accessToken, id) {
    if (accessToken) return; // BUG: Nên check !accessToken và throw error
    return await this.httpRequest.post(`/artists/${id}/follow`);
  }

  // Lấy đồng thời artist info và popular tracks
  async getArtistDetails(id, accessToken) {
    const [artistRes, albumsRes] = await Promise.all([
      this.getArtistById(id, accessToken),
      this.getArtistPopularTracks(id),
    ]);

    return {
      artist: artistRes.data,
      tracks: albumsRes.data.tracks,
    };
  }

  //Follow Artist
  async followArtist(accessToken, artistId) {
    if (!accessToken) {
      return;
    }
    const response = await this.httpRequest.post(
      `/artists/${artistId}/follow`,
      null,
      accessToken
    );

    return response;
  }

  //Unfollow Artist
  async unfollowArtist(accessToken, artistId) {
    if (!accessToken) {
      return;
    }

    const response = await this.httpRequest.del(
      `/artists/${artistId}/follow`,
      null,
      accessToken
    );

    return response;
  }
}

export default new ArtistService();
