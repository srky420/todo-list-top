class Sidebar {
  #sidebar;
  #sidebarOpen;
  
  #cacheDOM() {
    this.#sidebar = document.querySelector("aside");
    this.#sidebarOpen = document.querySelector(".aside-open-btn");
  }

  #addEventListeners() {
    this.#sidebarOpen.addEventListener("click", () => {
      this.#sidebar.classList.toggle("aside-open");
    });
  }

  init() {
    this.#cacheDOM();
    this.#addEventListeners();
  }
}

export default new Sidebar();