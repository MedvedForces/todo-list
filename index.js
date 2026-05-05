function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (callbacks) {
    Object.keys(callbacks).forEach((event) => {
      element.addEventListener(event, callbacks[event]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
    this._domNode = null;
    this.state = {};
  }

  update() {
    const newNode = this.render();
    if (this._domNode) {
      this._domNode.replaceWith(newNode);
    }
    this._domNode = newNode;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class AddTask extends Component {
  constructor({ inputValue, onAddInputChange, onAddTask }) {
    super();
    this.props = { inputValue, onAddInputChange, onAddTask };
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input", {
        id: "new-todo",
        type: "text",
        placeholder: "Задание",
        value: this.props.inputValue
      }, null, {
        input: this.props.onAddInputChange
      }),
      createElement("button", { id: "add-btn" }, "+", {
        click: this.props.onAddTask
      }),
    ]);
  }
}

class Task extends Component {
  constructor({ task, index, onToggleTask, onDeleteTask }) {
    super();
    this.state = { 
      task, 
      index,
      deleteConfirm: false 
    };
    this.onToggleTask = onToggleTask;
    this.onDeleteTask = onDeleteTask;
  }

  handleDelete = () => {
    if (!this.state.deleteConfirm) {
      this.setState({ deleteConfirm: true });
    } else {
      this.onDeleteTask(this.state.index);
    }
  };

  setState(newState) {
    Object.assign(this.state, newState);
    this.update();
  }

  render() {
    return createElement("li", {}, [
      createElement("input", {
        type: "checkbox",
        ...(this.state.task.completed ? { checked: true } : {})
      }, null, {
        change: () => this.onToggleTask(this.state.index)
      }),
      createElement("label", {
        style: this.state.task.completed ? "color: gray; text-decoration: line-through;" : ""
      }, this.state.task.text),
      createElement("button", {
        style: this.state.deleteConfirm ? "background-color: red;" : ""
      }, "🗑️", {
        click: this.handleDelete
      })
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { text: "Сделать домашку" },
        { text: "Сделать практику" },
        { text: "Пойти домой" }
      ],
      inputValue: ""
    };
  }

  onAddInputChange = (event) => {
    this.state.inputValue = event.target.value;
    // Убираем this.update() отсюда
  };

  onAddTask = () => {
    if (this.state.inputValue.trim() === "") return;
    this.state.tasks.push({ text: this.state.inputValue });
    this.state.inputValue = "";
    this.update();
  };

  onToggleTask = (index) => {
    this.state.tasks[index].completed = !this.state.tasks[index].completed;
    this.update();
  };

  onDeleteTask = (index) => {
    this.state.tasks.splice(index, 1);
    this.update();
  };

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask({
        inputValue: this.state.inputValue,
        onAddInputChange: this.onAddInputChange,
        onAddTask: this.onAddTask
      }).getDomNode(),
      createElement("ul", { id: "todos" },
        this.state.tasks.map((task, index) =>
          new Task({
            task,
            index,
            onToggleTask: this.onToggleTask,
            onDeleteTask: this.onDeleteTask
          }).getDomNode()
        )
      )
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});