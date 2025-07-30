import { KEYS, MODAL_CLASSES } from "../../utils/constants.js";
import { createElement } from "../../utils/helpers.js";

class SortDropdown {
  constructor() {
    this.sortBtn = document.querySelector(".sort-btn");
    this.dropdown = null;
    this.currentSort = "Gần đây";

    this.sortOptions = [
      { value: "recent", label: "Gần đây", icon: "fas fa-clock" },
      { value: "name", label: "Mới thêm gần đây", icon: "fas fa-plus" },
      {
        value: "alphabetical",
        label: "Thứ tự chữ cái",
        icon: "fas fa-sort-alpha-down",
      },
      { value: "creator", label: "Người sáng tạo", icon: "fas fa-user" },
    ];

    this.init();
  }

  init() {
    this.createDropdown();
    this.setupEvent();
    this.updateButtonText();
  }

  createDropdown() {
    this.dropdown = createElement("div", {
      className: "sort-dropdown",
    });

    const header = createElement("div", {
      className: "dropdown-header",
      innerHTML: "<span>Sắp xếp theo</span>",
    });

    const list = createElement("ul", {
      className: "dropdown-list",
    });

    this.sortOptions.forEach((option) => {
      const listItem = createElement("li", {
        className: `dropdown-item-sort ${
          option.value === "recent" ? "active" : ""
        }`,
        innerHTML: `
          <span class="item-text">${option.label}</span>
          <i class="fas fa-check check-icon"></i>
        `,
      });

      listItem.addEventListener("click", () => {
        this.selectOption(option);
      });

      list.appendChild(listItem);
    });

    const viewHeader = createElement("div", {
      className: "dropdown-header",
      innerHTML: "<span>Xem dưới dạng</span>",
    });

    const viewOptions = createElement("div", {
      className: "view-options",
    });

    const viewButtons = [
      { type: "list", icon: "fas fa-bars" },
      { type: "compact", icon: "fas fa-list" },
      { type: "grid", icon: "fas fa-th" },
      { type: "grid-large", icon: "fas fa-th-large" },
    ];

    viewButtons.forEach((btn, index) => {
      const viewBtn = createElement("button", {
        className: `view-btn ${index === 3 ? "active" : ""}`,
        innerHTML: `<i class="${btn.icon}"></i>`,
      });

      viewBtn.addEventListener("click", () => {
        this.selectView(btn.type, viewBtn);
      });

      viewOptions.appendChild(viewBtn);
    });

    this.dropdown.appendChild(header);
    this.dropdown.appendChild(list);
    this.dropdown.appendChild(viewHeader);
    this.dropdown.appendChild(viewOptions);

    this.sortBtn.parentNode.insertBefore(
      this.dropdown,
      this.sortBtn.nextSibling
    );
  }

  setupEvent() {
    this.sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (!this.sortBtn.contains(e.target)) {
        this.closeDropdown();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (
        e.key === KEYS.ESCAPE &&
        this.dropdown.classList.contains(MODAL_CLASSES.SHOW)
      ) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    this.dropdown.classList.toggle(MODAL_CLASSES.SHOW);
  }

  closeDropdown() {
    this.dropdown.classList.remove(MODAL_CLASSES.SHOW);
  }

  selectOption(option) {
    this.dropdown.querySelectorAll(".dropdown-item-sort").forEach((item) => {
      item.classList.remove("active");
    });

    const items = this.dropdown.querySelectorAll(".dropdown-item-sort");
    const selectedIndex = this.sortOptions.findIndex(
      (opt) => opt.value === option.value
    );
    items[selectedIndex].classList.add("active");

    this.currentSort = option.label;
    this.updateButtonText();

    this.closeDropdown();

    document.dispatchEvent(
      new CustomEvent("sortChanged", {
        detail: { sortBy: option.value, sortLabel: option.label },
      })
    );
  }

  selectView(viewType, buttonElement) {
    this.dropdown.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    buttonElement.classList.add("active");

    document.dispatchEvent(
      new CustomEvent("viewChanged", {
        detail: { viewType },
      })
    );
  }

  updateButtonText() {
    this.sortBtn.innerHTML = `
      <span class="text-sort">${this.currentSort}</span>
      <i class="fas fa-list"></i>
    `;
  }

  get getCurrentSort() {
    return this.currentSort;
  }
}

export default SortDropdown;
