import AuthService from "../../services/api/AuthService.js";
import { KEYS, MODAL_CLASSES } from "../../utils/constants.js";
import AuthButton from "./AuthButton.js";

class UserDropdown {
  constructor() {
    this.userMenu = document.querySelector(".user-menu");
    this.userAvatar = document.getElementById("userAvatar");
    this.userDropdown = document.getElementById("userDropdown");
    this.logoutBtn = document.getElementById("logoutBtn");
    this.authService = new AuthService();
    this.headerAction = document.querySelector(".header-actions");
    this.init();
  }

  init() {
    this.setUpEvent();
  }

  setUpEvent() {
    this.userAvatar.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (
        !this.userAvatar.contains(e.target) &&
        !this.userDropdown.contains(e.target)
      ) {
        this.closeDropdown();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === KEYS.ESCAPE &&
        this.userDropdown.classList.contains(MODAL_CLASSES.SHOW)
      ) {
        this.closeDropdown();
      }
    });

    this.logoutBtn.addEventListener("click", () => {
      this.handleLogout();
    });
  }

  toggleDropdown() {
    this.userDropdown.classList.toggle(MODAL_CLASSES.SHOW);
  }

  closeDropdown() {
    this.userDropdown.classList.remove(MODAL_CLASSES.SHOW);
  }

  handleLogout() {
    this.closeDropdown();
    this.authService.logout();
    this.authButtons = new AuthButton(this.headerAction, false);
    this.authButtons.render();
  }
}

export default UserDropdown;
