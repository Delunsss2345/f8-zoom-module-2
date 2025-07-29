import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";

class ArtistService {
  constructor() {
    this.httpRequest = HttpRequest;
  }
  // api/artists
  async getArtists(limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET) {
    return await this.httpRequest.get(
      `/artists?limit=${limit}&offset=${offset}`
    );
  }
  // api/artists/:artistId
  async getArtistById(id) {
    return await this.httpRequest.get(`/artists/${id}`);
  }

  // api/artists/:artistId/tracks/popular
  async getArtistPopularTracks(id) {
    return await this.httpRequest.get(`/artists/${id}/tracks/popular`);
  }

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

export default new ArtistService();
