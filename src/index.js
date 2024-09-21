import API from "./components/API";
import DOM from "./components/DOM";
import "./index.css";
import "./styles.css";

(function () {
  const defaultProject = API.createProject("", "", new Date());
  API.createTodo("Wash dishes", "Wash dishes", new Date(), 1, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date(), 2, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date(), 0, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('10-10-2024'), 1, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('10-10-2024'), 2, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('10-10-2024'), 0, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('11-09-2024'), 1, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('10-15-2024'), 2, defaultProject);
  API.createTodo("Wash dishes", "Wash dishes", new Date('10-20-2024'), 0, defaultProject);
  const gym = API.createProject("Gym", "Workout routine", new Date());
  API.createTodo("Cardio", "Do running workout", new Date('11-09-2024'), 2, gym);
  const home = API.createProject("Home", "Home chores", new Date());
  API.createTodo("Do dishes", "Do dishes", new Date(), 1, home);
  DOM.initialRender();
})();
