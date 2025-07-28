class HttpRequest {
  constructor() {
    this.baseUrl = "https://spotify.f8team.dev/api";
  }

  async _fetchApi(path, method = "GET", body) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const api = `${this.baseUrl}${path}`;
    const res = await fetch(api, options);

    if (!res.ok) {
      throw new Error("Lấy dữ liệu thất bại");
    }

    const data = await res.json();
    return data;
  }

  async get(path) {
    try {
      const data = await this._fetchApi(path, "GET");
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async post(path, body) {
    try {
      const data = await this._fetchApi(path, "POST", body);
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async put(path, body) {
    try {
      const data = await this._fetchApi(path, "PUT", body);
      return { success: true, data };
    } catch (err) {
      console.error(err.message);
      return { success: false, error: err.message };
    }
  }

  async patch(path, body) {
    try {
      const data = await this._fetchApi(path, "PATCH", body);
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
