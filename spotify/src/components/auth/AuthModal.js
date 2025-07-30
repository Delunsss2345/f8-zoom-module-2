import AuthService from "../../services/api/AuthService.js";
import { KEYS, MODAL_CLASSES } from "../../utils/constants.js";
import { toggleBodyScroll } from "../../utils/helpers.js";

class AuthModal {
  constructor() {
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

    this.userNameSignUpField = document.getElementById("signupUsername");
    this.emailSignUpField = document.getElementById("signupEmail");
    this.passwordSignUpField = document.getElementById("signupPassword");

    this.emailLoginField = document.getElementById("loginEmail");
    this.passwordLoginField = document.getElementById("loginPassword");
    this.authService = new AuthService(
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

  //Set up animation modal đẹp hơn
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
    this.signupForm.querySelector(".auth-form-content").onsubmit = (e) => {
      e.preventDefault();
    };
    this.loginForm.querySelector(".auth-form-content").onsubmit = (e) => {
      e.preventDefault();
    };

    this.submitSignUp.onclick = async (e) => {
      e.preventDefault();
      const data = {
        username: this.userNameSignUpField.value.trim(),
        email: this.emailSignUpField.value.trim(),
        password: this.passwordSignUpField.value.trim(),
      };
      await this.authService.registerUser(data);
    };

    this.submitLogin.onclick = async (e) => {
      e.preventDefault();
      const data = {
        email: this.emailLoginField.value.trim(),
        password: this.emailLoginField.value.trim(),
      };
      await this.authService.loginUser(data);
    };

    this.modalClose.addEventListener("click", () => this.closeModal());
    this.authModal.addEventListener("click", (e) => {
      if (e.target === this.authModal) {
        this.animationSetup("close");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === KEYS.ESCAPE &&
        this.authModal.classList.contains(MODAL_CLASSES.SHOW)
      ) {
        this.animationSetup("close");
      }
    });

    this.showLoginBtn.addEventListener("click", () => this.showLoginForm());
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
