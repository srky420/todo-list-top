import API from "./components/API";
import DOM from "./components/DOM";
import "./index.css";
import "./styles.css";

(function () {
  const defaultProject = API.createProject("", "", new Date());
  API.createTodo("Do homework", "Do todays math homework", new Date(), 1, defaultProject);
  API.createTodo("Do chores", "Take out trash, make bed etc.", new Date(), 2, defaultProject);
  const gym = API.createProject("Gym", "Workout routine", new Date());
  API.createTodo("Cardio", "Do running workout", new Date(), 2, gym);
  const home = API.createProject("Home", "Home chores", new Date());
  API.createTodo("Do dishes", "Do dishes", new Date(), 1, home);
  DOM.initialRender();
})();
