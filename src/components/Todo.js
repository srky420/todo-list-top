class Todo {
  constructor(name, description, dueDate, priority, projectName, notes) {
    this.name = name;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.done = false;
    this.projectName = projectName;
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
