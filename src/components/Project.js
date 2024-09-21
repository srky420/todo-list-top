import Todo from "./Todo";

class Project {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.dateCreated = new Date();
    this.todos = [];
  }
  addTodo(name, desc, dueDate, priority) {
    const todo = new Todo(name, desc, dueDate, priority, this.name);
    this.todos = [...this.todos, todo];
    return todo;
  }
  deleteTodo(index) {
    this.todos.splice(index, 1);
  }
  toggleDone(index) {
    this.todos[index].toggleDone();
  }
  getTodos() {
    return this.todos;
  }
}

export default Project;
