import { differenceInDays, isToday } from "date-fns";
import API from "./API";

class DOM {
  // Fields to store DOM elements
  #dialogElemProject;
  #dialogElemTodo;
  #todayBtn;
  #upcomingBtn;
  #allBtn;
  #contentBox;
  #asideBtns;
  #projectsList;
  #projectForm;
  #todoForm;
  #projectIndex;
  #tabName;

  constructor() {
    this.#cacheDom();
    this.#addEventListeners();
  }

  // Cache DOM elements for reference
  #cacheDom() {
    this.#dialogElemProject = document.querySelector("#project-form-dialog");
    this.#dialogElemTodo = document.querySelector("#todo-form-dialog");
    this.#todayBtn = document.querySelector("#today-btn");
    this.#upcomingBtn = document.querySelector("#upcoming-btn");
    this.#allBtn = document.querySelector("#all-btn");
    this.#contentBox = document.querySelector("#content");
    this.#asideBtns = document.querySelectorAll(".aside-btns > button");
    this.#projectsList = document.querySelector("#projects-list");
    this.#projectForm = document.querySelector("#project-form");
    this.#todoForm = document.querySelector("#todo-form");
  }

  // Add event listeners to DOM elements
  #addEventListeners() {
    // Dialog modal events
    document.querySelector(".add-project-btn").addEventListener("click", () =>
      this.#dialogElemProject.showModal()
    );
    this.#dialogElemProject.querySelector(".close").addEventListener("click", () =>
      this.#dialogElemProject.close()
    );
    this.#dialogElemTodo.querySelector(".close").addEventListener("click", () =>
      this.#dialogElemTodo.close()
    );

    // Today btn event
    this.#todayBtn.addEventListener("click", (e) => {
      this.#renderTab("Today", 0);
      this.#switchActiveBtn(e.currentTarget);
    });

    // Upcoming btn event
    this.#upcomingBtn.addEventListener("click", (e) => {
      this.#renderTab("Upcoming", 0);
      this.#switchActiveBtn(e.currentTarget);
    });

    // All btn event
    this.#allBtn.addEventListener("click", (e) => {
      this.#renderTab("All", 0);
      this.#switchActiveBtn(e.currentTarget);
    });

    // Project creation form submission event
    this.#projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      console.log(formData.title);
      API.createProject(formData.get("title"), formData.get("description"));
      this.#projectForm
        .querySelectorAll("input")
        .forEach((input) => (input.value = ""));
      this.#renderProjects(API.getAllProjects());
      this.#dialogElemProject.close();
    });

    // Todo creation form submission event
    this.#todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const project = API.getProjectByIndex(this.#projectIndex);
      this.#todoForm
        .querySelectorAll("input:not([type='radio'])")
        .forEach((input) => (input.value = ""));
      const todo = API.createTodo(
        formData.get("title"),
        formData.get("description"),
        formData.get("due-date"),
        parseInt(formData.get("priority")),
        project
      );
      this.#renderTab(this.#tabName, this.#projectIndex);
      this.#dialogElemTodo.close();
    });
  }

  // Custom methods
  #switchActiveBtn(btn) {
    this.#asideBtns.forEach((_btn) => _btn.classList.remove("active"));
    document.querySelectorAll("#projects-list > button").forEach((_btn) => _btn.classList.remove("active"))
    btn.classList.add("active");
  }

  // Render tab based on name or project index
  #renderTab(tabName, projectIndex) {
    this.#tabName = tabName;
    this.#projectIndex = projectIndex;
    switch(tabName) {
      case "Today":
        this.#renderTodos("Today", API.getTodosOfToday());
        return;
      case "Upcoming":
        this.#renderTodos("Upcoming", API.getUpcomingTodos());
        return;
      case "All":
        this.#renderTodos("All", API.getAllTodos());
        return;
    }
    const project = API.getProjectByIndex(projectIndex);
    this.#renderTodos(tabName, API.getTodosOfProject(project));
  }

  // Render todos list
  #renderTodos(tabName, todos) {
    this.#contentBox.innerHTML = `<h1>${tabName}</h1>`;

    // Add to do button and its event listener
    const button = document.createElement("button");
    button.classList.add("add-todo-btn");
    button.textContent = "+ Add Todo";
    button.addEventListener("click", (e) => {
      this.#dialogElemTodo.showModal();
      // Show today's due date for creating todo in 'Today' tab
      const dueDateInput = this.#dialogElemTodo.querySelector("#due-date");
      const dueDateLabel = this.#dialogElemTodo.querySelector("#due-date-label");
      if (tabName === "Today") {
        let now = new Date();
        let day = ("0" + now.getDate()).slice(-2);
        let month = ("0" + (now.getMonth() + 1)).slice(-2);
        let today = now.getFullYear() + "-" + month + "-" + day;
        dueDateInput.value = today;
        dueDateInput.style.display = "none";
        dueDateLabel.style.display = "none";
      }
      else {
        dueDateInput.style.display = "block";
        dueDateLabel.style.display = "block";
        dueDateInput.value = "";
      }
    });
    this.#contentBox.appendChild(button);
    todos.forEach((todo) => {
      this.#contentBox.appendChild(this.#createDivForATodo(todo));
    });
  }

  // Render a single todo
  #createDivForATodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    const label = document.createElement("label");
    label.addEventListener("click", () => {
      todo.done = true;
      label.querySelector("input").checked = true;
      label.querySelector("input").disabled = true;
      setTimeout(() => div.classList.add("removed-todo"), 250);
    });
    label.innerHTML = `
      <input type="checkbox" name="done" ${todo.done && "checked disabled"}>
      <div class="todo-inner"> 
        <p class="name">${todo.name}</p>
        <p>
          <small class="date">Due <i class="fa-solid fa-clock-rotate-left"></i> ${isToday(todo.dueDate) ? "Today" : todo.dueDate.toDateString()}</small> 
          <small class="project">${
            todo.projectName && "For " + todo.projectName
          }</small>
        </p>
      </div>`;
    div.appendChild(label);
    div.classList.add(
      todo.priority === 0 ? "low" : todo.priority === 1 ? "medium" : "high"
    );
    return div;
  }

  // Render projects list
  #renderProjects(projects) {
    this.#projectsList.innerHTML = "";
    if (projects.length === 1) {
      this.#projectsList.innerHTML = '<p class="empty">No Projects Yet.</p>';
    }
    projects.forEach((project, index) => {
      if (project.name !== "") {
        const button = document.createElement("button");
        button.addEventListener("click", (e) => {
          this.#renderTab(project.name, index);
          this.#switchActiveBtn(e.currentTarget);
        });
        button.innerHTML = `<i class="fa-solid fa-diagram-project"></i> ${project.name}`;
        this.#projectsList.append(button);
      }
    });
  }

  initialRender() {
    this.#renderTab("Today", 0);
    this.#renderProjects(API.getAllProjects());
  }

}

export default new DOM();
