import { API_BASE_URL } from "../../utils/constants.js";

class HttpRequest {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async _fetchApi(path, method = "GET", body, accessToken = null) {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const options = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const api = `${this.baseUrl}${path}`;

      const res = await fetch(api, options);

      if (!res.ok) {
        const errorBody = await res.json();
        return {
          success: false,
          errorBody,
        };
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  }

  async get(path, accessToken = null) {
    const body = null;
    try {
      const data = await this._fetchApi(path, "GET", body, accessToken);
      if (!data.success && data.errorBody) {
        return data;
      }
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async post(path, body, accessToken = null) {
    try {
      const data = await this._fetchApi(path, "POST", body, accessToken);

      console.log(data);
      if (!data.success && data.errorBody) {
        return data;
      }

      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async put(path, body, accessToken) {
    try {
      const data = await this._fetchApi(path, "PUT", body, accessToken);
      if (!data.success && data.errorBody) {
        return data;
      }
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async patch(path, body, accessToken) {
    try {
      const data = await this._fetchApi(path, "PATCH", body, accessToken);
      if (!data.success && data.errorBody) {
        return data;
      }
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async del(path, body = null) {
    try {
      const data = await this._fetchApi(path, "DELETE", body);
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }
}

export default new HttpRequest();
