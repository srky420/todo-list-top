import { differenceInDays, isToday } from "date-fns";
import API from "./API";

class DOM {
  // Fields to store DOM elements
  #dialogElemProject;
  #dialogElemTodo;
  #dialogElemEdit;
  #dialogDetails;
  #todayBtn;
  #upcomingBtn;
  #allBtn;
  #contentBox;
  #asideBtns;
  #projectsList;
  #projectForm;
  #todoForm;
  #editForm;
  #projectIndex;
  #tabName;
  #selectedTodo;

  constructor() {
    this.#cacheDom();
    this.#addEventListeners();
  }

  // Cache DOM elements for reference
  #cacheDom() {
    this.#dialogElemProject = document.querySelector("#project-form-dialog");
    this.#dialogElemTodo = document.querySelector("#todo-form-dialog");
    this.#dialogElemEdit = document.querySelector("#edit-form-dialog");
    this.#dialogDetails = document.querySelector("#details-dialog");
    this.#todayBtn = document.querySelector("#today-btn");
    this.#upcomingBtn = document.querySelector("#upcoming-btn");
    this.#allBtn = document.querySelector("#all-btn");
    this.#contentBox = document.querySelector("#content");
    this.#asideBtns = document.querySelectorAll(".aside-btns > button");
    this.#projectsList = document.querySelector("#projects-list");
    this.#projectForm = document.querySelector("#project-form");
    this.#todoForm = document.querySelector("#todo-form");
    this.#editForm = document.querySelector("#edit-form");
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
    this.#dialogElemTodo.querySelector(".close").addEventListener("click", () => {
      this.#dialogElemTodo.close();
    });
    this.#dialogElemEdit.querySelector(".close").addEventListener("click", () => {
      this.#dialogElemEdit.close();
    });
    this.#dialogDetails.querySelector(".close").addEventListener("click", () => {
      this.#dialogDetails.close();
    });

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
    this.#todoForm.addEventListener("submit", (e) => this.#todoFormSubmission(e));

    // Todo edit form submission event
    this.#editForm.addEventListener("submit", (e) => this.#editFormSubmission(e));
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
    this.#contentBox.innerHTML = `<h1 class="heading">${tabName}</h1>`;

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
        dueDateInput.value = this.#getInputDate();
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
    if (todos.length === 0) {
      const p = document.createElement("p");
      p.innerHTML += `<p class="empty">No Todos Yet.</p>`;
      this.#contentBox.appendChild(p);
    }
    else {
      todos.forEach((todo) => {
        this.#contentBox.appendChild(this.#createDivForATodo(todo));
      });
    }
  }

  // Render a single todo
  #createDivForATodo(todo) {
    const div = document.createElement("div");
    div.classList.add("todo");
    const dueDate = new Date(todo.dueDate);

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    if (todo.done) input.setAttribute("checked", true);
    input.addEventListener("click", () => {
      API.toggleDoneForTodo(todo);
    });

    const todoInner = document.createElement("div");
    todoInner.classList.add("todo-inner");
    todoInner.innerHTML = `
      <p class="name">${todo.name}</p>
        <p>
          <small class="date">
            Due <i class="fa-solid fa-clock-rotate-left"></i> ${isToday(dueDate) ? "Today" : dueDate.toDateString()}
          </small> 
          ${this.#projectIndex === 0 && todo.projectName ?
          `<small class="project">
             For ${todo.projectName}
          </small>`
          :
          ''
          }
      </p>
    `;

    // Todo details btn and its click event listener
    const detailsBtn = document.createElement("button");
    detailsBtn.addEventListener("click", (e) => {
      this.#dialogDetails.showModal();
      this.#dialogDetails.querySelector("#todo-name").innerText = todo.name;
      this.#dialogDetails.querySelector("#todo-desc").innerText = todo.description;
      this.#dialogDetails.querySelectorAll("input[name='details-priority']").forEach(box => {
        if (todo.priority == box.value) box.checked = true;
      });      
      this.#dialogDetails.querySelector("#todo-due-date").innerText = dueDate.toDateString();
    });
    detailsBtn.innerHTML = `<i class="fa-solid fa-circle-info"></i>`;
    detailsBtn.classList.add("todo-inner-btn");
    
    // Todo edit btn and its click event listener
    const editBtn = document.createElement("button");
    editBtn.classList.add("todo-inner-btn");
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editBtn.addEventListener("click", (e) => {
      this.#dialogElemEdit.showModal();
      this.#editForm.querySelector("#title").value = todo.name;
      this.#editForm.querySelector("#description").value = todo.description;
      this.#editForm.querySelectorAll("input[name='edit-priority']").forEach(box => {
        if (todo.priority == box.value) box.checked = true;
      });
      this.#editForm.querySelector("#due-date").value = this.#getInputDate(dueDate);
      this.#selectedTodo = todo;
    });

    // Delete todo btn and its click event listener
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("todo-inner-btn", "delete-btn");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.addEventListener("click", (e) => {
      API.deleteTodo(todo.projectIndex, todo.id);
      this.#renderTab(this.#tabName, this.#projectIndex);
    });

    div.appendChild(input);
    div.appendChild(todoInner);
    div.appendChild(editBtn);
    div.appendChild(detailsBtn);
    div.appendChild(deleteBtn);
    div.classList.add(
      todo.priority === 0 ? "low" : todo.priority === 1 ? "medium" : "high"
    );

    div.querySelectorAll("dialog .close")
      .forEach(btn => btn.addEventListener("click", (e) => {
        e.currentTarget.parentNode.close();
      }));
    return div;
  }

  // Render projects list in sidebar
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

  #getInputDate(date = new Date()) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + month + "-" + day;
    return today;
  }

  // Todo creation form submission logic
  #todoFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const project = API.getProjectByIndex(this.#projectIndex);
    e.currentTarget
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
  }

  // Todo edit form submission logic
  #editFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    e.currentTarget
      .querySelectorAll("input:not([type='radio'])")
      .forEach((input) => (input.value = ""));
    
    this.#selectedTodo.name = formData.get("title");
    this.#selectedTodo.description = formData.get("description");
    this.#selectedTodo.dueDate = new Date(formData.get("due-date"));
    this.#selectedTodo.priority = parseInt(formData.get("edit-priority"));

    this.#renderTab(this.#tabName, this.#projectIndex);
    this.#dialogElemEdit.close();
    API.saveProjects();
  }

  initialRender() {
    this.#renderTab("Today", 0);
    this.#renderProjects(API.getAllProjects());
  }
}

export default new DOM();
