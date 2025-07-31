import HomePage from "./pages/HomePage.js";

const auth = document.querySelector(".auth-buttons");
document.addEventListener("DOMContentLoaded", async function () {
  new HomePage();
  if (localStorage.getItem("accessToken")) {
    auth.style.display = "none" ; 
  }
});
