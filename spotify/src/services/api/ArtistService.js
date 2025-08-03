import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";

class ArtistService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  // /artists?limit=20&offset=0
  async getArtists(limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET) {
    return await this.httpRequest.get(
      `/artists?limit=${limit}&offset=${offset}`
    );
  }

  // Lấy thông tin chi tiết của 1 artist theo ID
  // /artists/:artistId
  async getArtistById(id) {
    return await this.httpRequest.get(`/artists/${id}`);
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
  async getArtistDetails(id) {
    const [artistRes, albumsRes] = await Promise.all([
      this.getArtistById(id),
      this.getArtistPopularTracks(id),
    ]);

    return {
      artist: artistRes.data,
      tracks: albumsRes.data.tracks,
    };
  }
}

// Export singleton instance - chỉ có 1 instance duy nhất trong app
export default new ArtistService();
