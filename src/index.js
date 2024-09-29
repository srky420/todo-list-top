import API from "./components/API";
import DOM from "./components/DOM";
import "./index.css";
import "./styles.css";

(function () {
  const projects = JSON.parse(localStorage.getItem("projects"))
  if (projects) {
    projects.forEach(project => API.createProject(project.name, project.description, project.todos))
    DOM.initialRender();
    console.log(API.getAllProjects());
  }
  else {
    const defaultProject = API.createProject("", "");
    API.createTodo("Do homework", "Do todays math homework", new Date(), 1, defaultProject);
    API.createTodo("Do chores", "Take out trash, make bed etc.", new Date(), 2, defaultProject);
    const gym = API.createProject("Gym", "Workout routine");
    API.createTodo("Cardio", "Do running workout", new Date(), 2, gym);
    const home = API.createProject("Home", "Home chores");
    API.createTodo("Do dishes", "Do dishes", new Date(), 1, home);
    API.saveProjects();
    DOM.initialRender();
    console.log(API.getAllProjects());
  }
})();
