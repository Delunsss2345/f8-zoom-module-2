import UserDropdown from "./UserDropdown.js";

class AuthButton {
  constructor(
    container,
    isLoggedIn = false,
    userAvatar = "placeholder.svg?height=32&width=32"
  ) {
    this.container = container;
    this.isLoggedIn = isLoggedIn;
    this.userAvatar = userAvatar;
  }
  setUpEvent() {}
  render() {
    this.container.innerHTML = "";
    if (!this.isLoggedIn) {
      console.log("Not login");
      const authButtons = document.createElement("div");
      authButtons.className = "auth-buttons";

      const signupBtn = document.createElement("button");
      signupBtn.className = "auth-btn signup-btn";
      signupBtn.textContent = "Sign up";

      const loginBtn = document.createElement("button");
      loginBtn.className = "auth-btn login-btn";
      loginBtn.textContent = "Log in";

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

      const dropdown = document.createElement("div");
      dropdown.className = "user-dropdown";
      dropdown.id = "userDropdown";

      const logoutItem = document.createElement("div");
      logoutItem.className = "dropdown-item";
      logoutItem.id = "logoutBtn";

      const logoutIcon = document.createElement("i");
      logoutIcon.className = "fas fa-sign-out-alt";

      const logoutText = document.createElement("span");
      logoutText.textContent = "Log out";

      logoutItem.appendChild(logoutIcon);
      logoutItem.appendChild(logoutText);
      dropdown.appendChild(logoutItem);

      userMenu.appendChild(avatarBtn);
      userMenu.appendChild(dropdown);
      this.container.appendChild(userMenu);

      this.userDropdown = new UserDropdown();
    }
  }
}
export default AuthButton;
