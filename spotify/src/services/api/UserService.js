import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "../../utils/constants.js";
import HttpRequest from "./HttpRequest.js";

class UserService {
  constructor() {
    this.httpRequest = HttpRequest;
  }

  ///playlists?limit=20&offset=0
  async getFollowing(
    accessToken,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET
  ) {
    return await this.httpRequest.get(`/me/playlists/followed`, accessToken);
  }
}

export default new UserService();
