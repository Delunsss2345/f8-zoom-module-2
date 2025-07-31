import HttpRequest from "./HttpRequest.js";

class AuthService {
  constructor() {
    this.httpRequest = HttpRequest;
    this._authUser = null;
    this.headerAction = document.querySelector(".header-actions");
  }

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

    this.userNameSignUpError = document.querySelector(".signup-user-err");
    this.emailSignUpError = document.querySelector(".signup-email-err");
    this.passwordSignUpError = document.querySelector(".signup-pass-err");
  }
  handleSignUpError(response, email, password, userName) {
    if (!response.success && response.success !== undefined) {
      const error = response.errorBody.error;

      if (error.code === "EMAIL_EXISTS") {
        email.textContent = error.message;
        this.setFieldInvalid(email);
        return true;
      }

      if (error.code === "USERNAME_EXISTS") {
        userName.textContent = error.message;
        this.setFieldInvalid(userName);
        return true;
      }

      if (error.code === "INVALID_CREDENTIALS") {
        email.textContent = error.message;
        this.setFieldInvalid(email);
        if (userName) {
          userName.textContent = error.message;
          this.setFieldInvalid(userName);
        }
        return true;
      }

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

  async registerUser(data) {
    this.clearFieldErrors();

    const response = await this.httpRequest.post("/auth/register", data);

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
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    }

    return false;
  }

  async loginUser(data) {
    this.clearFieldErrors();
    try {
      const response = await this.httpRequest.post("/auth/login", data);

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

  isLoggedIn() {
    return !!localStorage.getItem("accessToken");
  }

  logout() {
    this._authUser = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  get authUser() {
    return this._authUser;
  }

  setFieldInvalid(inputElement) {
    if (!inputElement) return;

    inputElement.closest(".form-group").classList.add("invalid");
  }

  clearFieldErrors() {
    const fields = [
      this.userNameSignUpField,
      this.emailSignUpField,
      this.passwordSignUpField,
      this.emailLoginField,
      this.passwordLoginField,
    ];

    for (const field of fields) {
      if (!field) continue;

      field.closest(".form-group").classList.remove("invalid");
    }
  }
}

export default AuthService;
