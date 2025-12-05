import { TaskModel } from "./model.js";
import { TaskView } from "./view.js";

export class TaskController {
  constructor() {
    this.model = new TaskModel();
    this.view = new TaskView();

    this.view.bindAddTask(this.handleAddTask);
    this.view.bindDeleteTask(this.handleDeleteTask);
    this.view.bindDragDrop(this.handleMoveTask);
    this.view.bindEditTask(this.handleEditTask);

    this.view.render(this.model);
  }
  handleAddTask = () => {
    console.log("Adding task");
    const text = this.view.input.value.trim();
    if (!text) return this.view.showError("Enter a task!");
    if (text.length < 3) return this.view.showError("Min 3 characters!");

    this.model.add(text);
    this.model.save();
    this.view.render(this.model);

    this.view.clearInput();
    this.view.showError("");
  };

  handleDeleteTask = (id) => {
    console.log(`Deleting task ${id}`);
    this.model.delete(id);
    this.view.render(this.model);
  };

  handleMoveTask = (id, newStatus) => {
    const colTasks = [
      ...document.querySelectorAll(`[data-column="${newStatus}"] .task-card`),
    ];

    colTasks.forEach((card, index) => {
      const task = this.model.tasks.find((t) => t.id === card.dataset.id);
      if (task) {
        task.status = newStatus;
        task.order = index;
      }
    });

    this.model.save();
    this.view.render(this.model);
  };

  handleEditTask = (id, text) => {
    const task = this.model.tasks.find((t) => t.id === id);
    if (task) {
      task.text = text;
      this.model.save();
      this.view.render(this.model);
    }
  };
}
new TaskController();
