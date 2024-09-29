import API from "./API";
import Todo from "./Todo";

class Project {
  constructor(name, description, todos = []) {
    this.id = API.getAllProjects().length + 1;
    this.name = name;
    this.description = description;
    this.todos = todos;
  }
  addTodo(name, desc, dueDate, priority, index) {
    const todo = new Todo(name, desc, dueDate, priority, this.name, index);
    this.todos = [...this.todos, todo];
    return todo;
  }
  deleteTodo(id) {
    this.todos = [...this.todos.filter(todo => todo.id !== id)];
  }
  getTodos() {
    return this.todos;
  }
}

export default Project;
