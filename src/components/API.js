import { isAfter, isEqual, isToday } from "date-fns";
import Project from "./Project";
import Storage from "./Storage";

class API {
  // Create a new project
  createProject(name, description) {
    const project = new Project(name, description);
    Storage.addProject(project);
    return project;
  }

  // Create new todo for a certain project
  createTodo(name, description, dueDate, priority, project) {
    return project.addTodo(name, description, new Date(dueDate), priority);
  }

  // Toggle done flag of a todo of a certain project
  toggleTodoOfProject(project, index) {
    project.toggleDone(index);
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
    return Storage.getAllProjects().flatMap(project => project.todos.filter(todo => isToday(todo.dueDate) && !todo.done))
  }

  // Get all projects and todos which are upcoming
  getUpcomingTodos() {
    return Storage.getAllProjects().flatMap(project => project.todos.filter(todo => isAfter(todo.dueDate, new Date()) && !todo.done))
  }

  // Get all projects from Storage
  getAllTodos() {
    return Storage.getAllProjects().flatMap(project => project.todos.filter(todo => !todo.done));
  }

  // Get all todos of a certain project
  getTodosOfProject(project) {
    return project.getTodos();
  }
}

export default new API();
