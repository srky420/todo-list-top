import { isAfter, isEqual, isToday } from "date-fns";
import Project from "./Project";
import Storage from "./Storage";

class API {

  // Create a new project
  createProject(name, description, todos = []) {
    const project = new Project(name, description, todos);
    Storage.addProject(project);
    Storage.store();
    return project;
  }

  // Create new todo for a certain project
  createTodo(name, description, dueDate, priority, project) {
    const index = Storage.getAllProjects().findIndex(_project => _project === project);
    const todo = project.addTodo(name, description, new Date(dueDate), priority, index);
    Storage.store();
    return todo;
  }

  // Remove todo from a project
  deleteTodo(projectIndex, todoId) {
    this.getProjectByIndex(projectIndex).deleteTodo(todoId);
    Storage.store();
  }

  // Toggle done for todo
  toggleDoneForTodo(todo) {
    todo.done = !todo.done;
    Storage.store();
  }
  
  // Get project by index
  getProjectByIndex(index) {
    return Storage.getAllProjects()[index];
  }

  // Get all projects
  getAllProjects() {
    return Storage.getAllProjects();
  }

  // Get all projects and todos which have today as due date
  getTodosOfToday() {
    return Storage.getAllProjects().flatMap(project => project.todos.filter(todo => isToday(new Date(todo.dueDate))))
  }

  // Get all projects and todos which are upcoming
  getUpcomingTodos() {
    return Storage.getAllProjects().flatMap(project => project.todos.filter(todo => isAfter(new Date(todo.dueDate), new Date())))
  }

  // Get all projects from Storage
  getAllTodos() {
    return Storage.getAllProjects().flatMap(project => project.todos);
  }

  // Get all todos of a certain project
  getTodosOfProject(project) {
    return project.getTodos();
  }

  // Store the projects in Local Storage
  saveProjects() {
    Storage.store();
  }
}

export default new API();
