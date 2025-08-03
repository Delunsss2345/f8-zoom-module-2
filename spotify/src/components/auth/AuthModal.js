import AuthService from "../../services/api/AuthService.js";
import { KEYS, MODAL_CLASSES } from "../../utils/constants.js";
import { toggleBodyScroll } from "../../utils/helpers.js";
import AuthButton from "./AuthButton.js";

class AuthModal {
  constructor() {
    // DOM element references
    this.submitSignUp = document.querySelector(".auth-submit-btn.signup-btn");
    this.submitLogin = document.querySelector(".auth-submit-btn.login-btn");
    this.authModal = document.getElementById("authModal");
    this.modalClose = document.getElementById("modalClose");
    this.signupForm = document.getElementById("signupForm");
    this.loginForm = document.getElementById("loginForm");
    this.showLoginBtn = document.getElementById("showLogin");
    this.showSignupBtn = document.getElementById("showSignup");
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
    this.authService = new AuthService();
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

  //  Setup animation cho modal
  animationSetup(key) {
    if (key === "open") {
      this.overLay.style.animation = "fadeIn 0.2s ease";
      this.modalContainer.style.animation = "modalSlideIn 0.2s ease";
    } else if (key === "close") {
      this.modalContainer.style.animation = "modalSlideOut 0.2s ease";
      this.overLay.style.animation = "fadeOut 0.2s ease";

      const handleAnimationEnd = () => {
        this.modalContainer.removeEventListener(
          "animationend",
          handleAnimationEnd
        );
        this.overLay.style.animation = "";
        this.closeModal();
      };
      this.modalContainer.addEventListener("animationend", handleAnimationEnd);
    }
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
        this.animationSetup("close");

        // Render nút user đã đăng nhập
        this.authButtons = new AuthButton(this.headerAction, true);
        this.authButtons.render();
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
        this.animationSetup("close");

        // Render lại header với nút user đã login
        this.authButtons = new AuthButton(this.headerAction, true);
        this.authButtons.render();
      }
    };

    // Sự kiện click nút đóng modal
    this.modalClose.addEventListener("click", (e) => {
      this.animationSetup("close");
    });

    // Đóng modal khi click ra ngoài form (click vào nền mờ)
    this.authModal.addEventListener("click", (e) => {
      if (e.target === this.authModal) {
        this.animationSetup("close");
      }
    });

    // Đóng modal khi bấm phím Escape
    document.addEventListener("keydown", (e) => {
      if (
        e.key === KEYS.ESCAPE &&
        this.authModal.classList.contains(MODAL_CLASSES.SHOW)
      ) {
        this.animationSetup("close");
      }
    });

    // Hiển thị form đăng nhập khi người dùng nhấn "Đăng nhập"
    this.showLoginBtn.addEventListener("click", () => this.showLoginForm());

    // Hiển thị form đăng ký khi người dùng nhấn "Đăng ký"
    this.showSignupBtn.addEventListener("click", () => this.showSignupForm());
  }

  showSignupForm() {
    this.animationSetup("open");
    this.signupForm.style.display = "block";
    this.loginForm.style.display = "none";
  }

  showLoginForm() {
    this.animationSetup("open");
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
