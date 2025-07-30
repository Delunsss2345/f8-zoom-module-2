import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";

class TrackService {
  constructor() {
    this.httpRequest = HttpRequest;
  }
  async getPopularTracks() {
    return await this.httpRequest.get(
      `/tracks/popular`
    );
  }

  async getTrendingTracks(DEFAULT_LIMIT) {
    return await this.httpRequest.get(
      `/tracks/trending?limit=${DEFAULT_LIMIT}`
    );
  }
}

export default new TrackService();
