import API from "./API";

class Todo {
  constructor(name, description, dueDate, priority, projectName, projectIndex, notes) {
    this.id = API.getProjectByIndex(projectIndex).todos.length + 1;
    this.name = name;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.done = false;
    this.projectName = projectName;
    this.projectIndex = projectIndex;
    this.notes = notes === "" ? "" : notes;
  }
  toggleDone() {
    this.done = !this.done;
  }
  changePriority(newPriority) {
    this.priority = newPriority;
  }
}

export default Todo;
