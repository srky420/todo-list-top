class Storage {
  #projects = [];
  addProject(project) {
    this.#projects = [...this.#projects, project];
  }
  deleteProject(index) {
    this.#projects.splice(index, 1);
  }
  getAllProjects() {
    return this.#projects;
  }
}

export default new Storage();
