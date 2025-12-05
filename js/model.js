const STORAGE_KEY = "KANBAN_TASKS";
export class TaskModel {
  constructor() {
    this.task = [];
    this.load();
  }
  load() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }
  getByStatus(status) {
    return this.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);
  }

  add(text) {
    const task = {
      id: Date.now().toString(),
      text,
      status: "todo",
      order: this.tasks.length, // 🔥 lưu thứ tự ban đầu
    };
    this.tasks.push(task);
    this.save();
    return task;
  }

  delete(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }
  move(id, newStatus, newOrder) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = newStatus;
      task.order = newOrder;
      this.save();
    }
  }
}
