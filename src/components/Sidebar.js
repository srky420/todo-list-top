class Sidebar {
  #sidebar;
  #sidebarOpen;
  #sidebarIcons;
  #overlay;
  
  #cacheDOM() {
    this.#sidebar = document.querySelector("aside");
    this.#sidebarOpen = document.querySelector(".aside-open-btn");
    this.#sidebarIcons = this.#sidebarOpen.querySelectorAll("i");
    this.#overlay = document.querySelector(".sidebar-overlay");
  }

  #addEventListeners() {
    this.#sidebarOpen.addEventListener("click", () => {
      this.#sidebar.classList.toggle("aside-open");
      this.#sidebarIcons.forEach(i => i.classList.toggle("hidden"));
    });
  }

  init() {
    this.#cacheDOM();
    this.#addEventListeners();
  }
}

export default new Sidebar();