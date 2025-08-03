import HttpRequest from "./HttpRequest.js";

class AuthService {
  constructor() {
    this.httpRequest = HttpRequest;
    this._authUser = null; // Cache user data trong memory
    this.headerAction = document.querySelector(".header-actions");
  }

  // Khởi tạo DOM elements để service có thể thao tác với form fields
  setDom(
    userNameSignUpField,
    emailSignUpField,
    passwordSignUpField,
    emailLoginField,
    passwordLoginField
  ) {
    this.userNameSignUpField = userNameSignUpField;
    this.emailSignUpField = emailSignUpField;
    this.passwordSignUpField = passwordSignUpField;

    this.emailLoginField = emailLoginField;
    this.passwordLoginField = passwordLoginField;

    // Tìm các error message elements
    this.userNameSignUpError = document.querySelector(".signup-user-err");
    this.emailSignUpError = document.querySelector(".signup-email-err");
    this.passwordSignUpError = document.querySelector(".signup-pass-err");
  }

  // Xử lý và hiển thị lỗi từ signup API response
  handleSignUpError(response, email, password, userName) {
    // Kiếm tra có success và success không underined
    if (!response.success && response.success !== undefined) {
      const error = response.errorBody.error; // lấy ra lỗi

      // Kiếm tra lỗi email
      if (error.code === "EMAIL_EXISTS") {
        email.textContent = error.message;
        this.setFieldInvalid(email);
        return true;
      }

      // Kiểm tra lỗi user
      if (error.code === "USERNAME_EXISTS") {
        userName.textContent = error.message;
        this.setFieldInvalid(userName);
        return true;
      }

      // Kiếm tra lỗi ở cả 2 email và user
      if (error.code === "INVALID_CREDENTIALS") {
        email.textContent = error.message;
        this.setFieldInvalid(email);
        if (userName) {
          userName.textContent = error.message;
          this.setFieldInvalid(userName);
        }
        return true;
      }
      // Lấy ra chi tiết lỗi
      const details = error.details || [];
      details.forEach((detail) => {
        switch (detail.field) {
          case "email":
            email.textContent = detail.message;
            this.setFieldInvalid(email);
            break;
          case "username":
            userName.textContent = detail.message;
            this.setFieldInvalid(userName);
            break;
          case "password":
            password.textContent = detail.message;
            this.setFieldInvalid(password);
            break;
        }
      });

      return true;
    }

    return false;
  }

  // Hàm để đăng ký user
  async registerUser(data) {
    // Xoá tất cả các lỗi
    this.clearFieldErrors();

    // Đăng ký
    const response = await this.httpRequest.post("/auth/register", data);

    // Kiếm tra xem có lỗi không nếu có không lọt
    if (
      !this.handleSignUpError(
        response,
        this.emailSignUpField,
        this.passwordSignUpField,
        this.userNameSignUpField
      )
    ) {
      console.log(response);
      const { access_token } = response.data;
      const user = response.data.user;

      this._authUser = user;
      // Thêm dữ liệu token và user vào localSt
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    }

    return false;
  }

  // Hàm login
  async loginUser(data) {
    // Xoá lỗi
    this.clearFieldErrors();
    try {
      const response = await this.httpRequest.post("/auth/login", data);

      // Tương tự register
      if (
        !this.handleSignUpError(
          response,
          this.emailLoginField,
          this.passwordLoginField
        )
      ) {
        const { access_token } = response.data;
        const user = response.data.user;
        this._authUser = user;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
    }
  }

  // Hàm kiểm tra có login chưa
  isLoggedIn() {
    return !!localStorage.getItem("accessToken");
  }

  // Hàm logout
  logout() {
    this._authUser = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  // Get auth user
  get authUser() {
    return this._authUser;
  }

  // Set lỗi
  setFieldInvalid(inputElement) {
    if (!inputElement) return;

    inputElement.closest(".form-group").classList.add("invalid");
  }

  // Xoá taart cả lỗi
  clearFieldErrors() {
    const fields = [
      this.userNameSignUpField,
      this.emailSignUpField,
      this.passwordSignUpField,
      this.emailLoginField,
      this.passwordLoginField,
    ];
    // Field nào không lỗi thì bỏ qua
    for (const field of fields) {
      if (!field) continue;

      field.closest(".form-group").classList.remove("invalid");
    }
  }
}

export default AuthService;
