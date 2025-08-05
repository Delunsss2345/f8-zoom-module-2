import { MODAL_CLASSES } from "../../utils/constants.js";
import { modalAnimationHelper, toggleBodyScroll } from "../../utils/helpers.js";
import UserDropdown from "./UserDropdown.js";

class AuthButton {
  constructor(
    container,
    isLoggedIn = false,
    userAvatar = "placeholder.svg?height=32&width=32"
  ) {
    this.authModal = document.getElementById("authModal");
    this.container = container;
    this.isLoggedIn = isLoggedIn;
    this.userAvatar = userAvatar;
    this.modalContainer = document.querySelector(".modal-container");
    this.overLay = document.querySelector(".modal-overlay");
    this.signupForm = document.getElementById("signupForm");
    this.loginForm = document.getElementById("loginForm");
  }
  render() {
    this.container.innerHTML = "";
    if (!this.isLoggedIn) {
      console.log("Not login");
      const authButtons = document.createElement("div");
      authButtons.className = "auth-btn";

      const signupBtn = document.createElement("button");
      signupBtn.className = "auth-btn signup-btn";
      signupBtn.textContent = "Sign up";

      const loginBtn = document.createElement("button");
      loginBtn.className = "auth-btn login-btn";
      loginBtn.textContent = "Log in";

      loginBtn.onclick = () => {
        console.log("ok");
        this.showLoginForm();
      };
      signupBtn.onclick = () => this.showSignupForm();
      authButtons.appendChild(signupBtn);
      authButtons.appendChild(loginBtn);

      this.container.appendChild(authButtons);
    } else {
      console.log("login");
      const userMenu = document.createElement("div");
      userMenu.className = "user-menu";

      const avatarBtn = document.createElement("button");
      avatarBtn.className = "user-avatar";
      avatarBtn.id = "userAvatar";

      const avatarImg = document.createElement("img");
      avatarImg.src =
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" ||
        this.userAvatar;
      avatarImg.alt = "User Avatar";

      avatarBtn.appendChild(avatarImg);

      // Dropdown menu
      const dropdown = document.createElement("div");
      dropdown.className = "user-dropdown";
      dropdown.id = "userDropdown";

      const menuItems = [
        { label: "Tài khoản", external: true },
        { label: "Hồ sơ", external: false },
        { label: "Nâng cấp lên Premium", external: true },
        { label: "Hỗ trợ", external: true },
        { label: "Tải xuống", external: true },
        { label: "Cài đặt", external: false },
        { label: "Đăng xuất", isLogout: true },
      ];

      menuItems.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = `dropdown-item${item.isLogout ? " logout" : ""}`;

        const span = document.createElement("span");
        span.textContent = item.label;

        itemDiv.appendChild(span);

        if (item.external) {
          const icon = document.createElement("i");
          icon.className = "fas fa-external-link-alt";
          itemDiv.appendChild(icon);
        }

        if (item.isLogout) {
          itemDiv.id = "logoutBtn";
        }

        dropdown.appendChild(itemDiv);
      });

      userMenu.appendChild(avatarBtn);
      userMenu.appendChild(dropdown);
      this.container.appendChild(userMenu);

      this.userDropdown = new UserDropdown();
    }
  }
  showLoginForm() {
    modalAnimationHelper("open", this.modalContainer, this.overLay);
    this.loginForm.style.display = "block";
    this.signupForm.style.display = "none";
    this.openModal();
  }

  showSignupForm() {
    modalAnimationHelper("open", this.modalContainer, this.overLay);
    this.signupForm.style.display = "block";
    this.loginForm.style.display = "none";
    this.openModal();
  }
  openModal() {
    this.authModal.classList.add(MODAL_CLASSES.SHOW);
    toggleBodyScroll(true);
  }

  closeModal() {
    this.authModal.classList.remove(MODAL_CLASSES.SHOW);
    toggleBodyScroll(false);
  }
}

export default AuthButton;
