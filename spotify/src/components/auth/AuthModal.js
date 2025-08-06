import AuthService from "../../services/api/AuthService.js";
import { KEYS, MODAL_CLASSES } from "../../utils/constants.js";
import { modalAnimationHelper, toggleBodyScroll } from "../../utils/helpers.js";
import AuthButton from "./AuthButton.js";

class AuthModal {
  constructor(setLibraryArtist, setLibraryPlaylist) {
    this.setLibraryArtist = setLibraryArtist;
    this.setLibraryPlaylist = setLibraryPlaylist;

    // DOM element references
    this.submitSignUp = document.querySelector(".auth-submit-btn.signup-btn");
    this.submitLogin = document.querySelector(".auth-submit-btn.login-btn");
    this.authModal = document.getElementById("authModal");
    this.modalClose = document.getElementById("modalClose");
    this.signupForm = document.getElementById("signupForm");
    this.loginForm = document.getElementById("loginForm");
    this.showLoginBtn = document.querySelector(".auth-btn.login-btn");
    this.showSignupBtn = document.querySelector(".auth-btn.signup-btn");
    this.modalContainer = document.querySelector(".modal-container");
    this.overLay = document.querySelector(".modal-overlay");

    // Header để update UI sau khi login
    this.headerAction = document.querySelector(".header-actions");

    // Form input
    this.userNameSignUpField = document.getElementById("signupUsername");
    this.emailSignUpField = document.getElementById("signupEmail");
    this.passwordSignUpField = document.getElementById("signupPassword");

    this.emailLoginField = document.getElementById("loginEmail");
    this.passwordLoginField = document.getElementById("loginPassword");

    // Initialize AuthService và setup DOM
    this.authService = new AuthService(
      this.setLibraryArtist.bind(this),
      this.setLibraryPlaylist.bind(this)
    );
    this.authService.setDom(
      this.userNameSignUpField,
      this.emailSignUpField,
      this.passwordSignUpField,
      this.emailLoginField,
      this.passwordLoginField
    );

    this.init();
  }

  init() {
    this.setUpEvent();
  }

  setUpEvent() {
    // Ngăn hành vi submit mặc định của form đăng ký (tránh reload trang)
    this.signupForm.querySelector(".auth-form-content").onsubmit = (e) => {
      e.preventDefault();
    };

    // Ngăn hành vi submit mặc định của form đăng nhập
    this.loginForm.querySelector(".auth-form-content").onsubmit = (e) => {
      e.preventDefault();
    };

    // Sự kiện khi nhấn nút đăng ký
    this.submitSignUp.onclick = async (e) => {
      e.preventDefault();

      // Lấy dữ liệu từ các ô input
      const data = {
        username: this.userNameSignUpField.value.trim(),
        email: this.emailSignUpField.value.trim(),
        password: this.passwordSignUpField.value.trim(),
      };

      // Gửi dữ liệu đến API đăng ký
      const result = await this.authService.registerUser(data);

      // Nếu đăng ký thành công
      if (result) {
        // Reset form
        this.signupForm.querySelector(".auth-form-content").reset();

        // Đóng modal
        modalAnimationHelper(
          "close",
          this.modalContainer,
          this.overLay,
          this.closeModal.bind(this)
        );

        // Render nút user đã đăng nhập
        this.authButtons = new AuthButton(this.headerAction, true);
        this.authButtons.render();
        document.dispatchEvent(new CustomEvent("loginChanged"));
      }
    };

    // Sự kiện khi nhấn nút đăng nhập
    this.submitLogin.onclick = async (e) => {
      e.preventDefault();

      // Lấy dữ liệu từ các ô input
      const data = {
        email: this.emailLoginField.value.trim(),
        password: this.passwordLoginField.value.trim(),
      };

      console.log(data); // debug: log dữ liệu login

      // Gửi dữ liệu đến API đăng nhập
      const result = await this.authService.loginUser(data);

      // Nếu đăng nhập thành công
      if (result) {
        // Reset form
        this.loginForm.querySelector(".auth-form-content").reset();

        // Đóng modal
        modalAnimationHelper(
          "close",
          this.modalContainer,
          this.overLay,
          this.closeModal.bind(this)
        );

        // Render lại header với nút user đã login
        this.authButtons = new AuthButton(this.headerAction, true);
        this.authButtons.render();
        document.dispatchEvent(new CustomEvent("loginChanged"));
      }
    };

    // Sự kiện click nút đóng modal
    this.modalClose.onclick = (e) => {
      modalAnimationHelper(
        "close",
        this.modalContainer,
        this.overLay,
        this.closeModal.bind(this)
      );
    };

    // Đóng modal khi click ra ngoài form (click vào nền mờ)
    this.authModal.onclick = (e) => {
      if (e.target === this.authModal) {
        modalAnimationHelper(
          "close",
          this.modalContainer,
          this.overLay,
          this.closeModal.bind(this)
        );
      }
    };

    // Đóng modal khi bấm phím Escape
    document.addEventListener("keydown", (e) => {
      if (
        e.key === KEYS.ESCAPE &&
        this.authModal.classList.contains(MODAL_CLASSES.SHOW)
      ) {
        modalAnimationHelper(
          "close",
          this.modalContainer,
          this.overLay,
          this.closeModal.bind(this)
        );
      }
    });
  }

  showSignupForm() {
    modalAnimationHelper("open", this.modalContainer, this.overLay);

    this.signupForm.style.display = "block";
    this.loginForm.style.display = "none";
  }

  showLoginForm() {
    modalAnimationHelper("open", this.modalContainer, this.overLay);

    this.loginForm.style.display = "block";
    this.signupForm.style.display = "none";
  }

  openModal() {
    this.authModal.classList.add(MODAL_CLASSES.SHOW);
    toggleBodyScroll(true);
  }

  closeModal() {
    this.authModal.classList.remove(MODAL_CLASSES.SHOW);
    toggleBodyScroll(false);
  }

  openWithSignup() {
    this.showSignupForm();
    this.openModal();
  }

  openWithLogin() {
    this.showLoginForm();
    this.openModal();
  }
}

export default AuthModal;
