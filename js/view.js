export class TaskView {
  constructor() {
    this.columns = {
      todo: document.querySelector('[data-column="todo"]'),
      doing: document.querySelector('[data-column="doing"]'),
      done: document.querySelector('[data-column="done"]'),
    };
    this.input = document.getElementById("task-input");
    this.addBtn = document.getElementById("add-task-button");
    this.board = document.querySelector(".board");
    this.errorMsg = document.createElement("p");
    this.errorMsg.style.color = "#dc2626";
    this.errorMsg.style.fontSize = "0.85rem";
    this.errorMsg.style.marginTop = "4px";
    this.input.insertAdjacentElement("afterend", this.errorMsg);
    this.handlers = {};
  }
  bindAddTask(handler) {
    this.addBtn.addEventListener("click", handler);
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handler();
      }
    });
  }
  bindDeleteTask(handler) {
    this.board.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.closest(".task-card").dataset.id;
        handler(id);
      }
    });
  }
  bindDragDrop(handler) {
    let draggedId = null;

    this.board.addEventListener("dragstart", (e) => {
      const card = e.target.closest(".task-card");
      if (!card) return;
      draggedId = card.dataset.id;
      card.classList.add("dragging");
    });

    this.board.addEventListener("dragend", (e) => {
      const card = e.target.closest(".task-card");
      if (card) card.classList.remove("dragging");
    });

    Object.values(this.columns).forEach((col) => {
      col.addEventListener("dragover", (e) => e.preventDefault());
      col.addEventListener("drop", (e) => {
        e.preventDefault();

        const draggedCard = document.querySelector(`[data-id="${draggedId}"]`);
        const tasksInCol = [
          ...col.querySelectorAll(".task-card:not(.dragging)"),
        ];

        let newOrder = tasksInCol.length;

        const closestCard = tasksInCol.find((c) => {
          const rect = c.getBoundingClientRect();
          return e.clientY < rect.top + rect.height / 2;
        });

        if (closestCard) {
          col.insertBefore(draggedCard, closestCard);
          newOrder = tasksInCol.indexOf(closestCard);
        } else {
          col.appendChild(draggedCard);
        }

        const newStatus = col.dataset.column;

        handler(draggedId, newStatus, newOrder);
      });
    });
  }

  showError(msg) {
    this.errorMsg.textContent = msg || "";
  }

  clearInput() {
    this.input.value = "";
    this.input.focus();
  }

  render(model) {
    // clear
    Object.values(this.columns).forEach((col) => (col.innerHTML = ""));

    // render each column
    ["todo", "doing", "done"].forEach((status) => {
      const list = model.getByStatus(status);
      const col = this.columns[status];

      if (list.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No tasks yet";
        empty.style.textAlign = "center";
        empty.style.color = "#94a3b8";
        col.appendChild(empty);
        return;
      }

      list.forEach((t) => {
        const card = document.createElement("div");
        card.classList.add("task-card");
        card.draggable = true;
        card.dataset.id = t.id;
        card.innerHTML = `
          <span>${t.text}</span>
          <button class="delete-btn">🗑️</button>
        `;
        col.appendChild(card);
      });
    });
  }
  bindEditTask(handler) {
    this.board.addEventListener("dblclick", (e) => {
      const card = e.target.closest(".task-card");
      if (!card) return;

      const id = card.dataset.id;
      const textEl = card.querySelector("span");
      const oldText = textEl.textContent;

      const input = document.createElement("input");
      input.className = "edit-input";
      input.value = oldText;
      textEl.replaceWith(input);
      input.focus();

      const save = () => {
        const newText = input.value.trim();
        if (newText && newText !== oldText) {
          handler(id, newText);
        } else {
          input.replaceWith(textEl);
        }
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") input.replaceWith(textEl);
      });

      input.addEventListener("blur", save);
    });
  }
}
