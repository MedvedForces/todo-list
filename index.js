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

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        {text: "Сделать домашку"},
        {text: "Сделать практику"},
        {text: "Пойти домой"}
      ],

      inputValue: ""
    };
  }

  onAddInputChange = (event) => {
    this.state.inputValue = event.target.value;
  };

  onAddTask = () => {
    if (this.state.inputValue.trim() === "") 
      return;
    this.state.tasks.push({text: this.state.inputValue});
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
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.state.inputValue
        }, null, {
          input: this.onAddInputChange
        }),
        createElement("button", { id: "add-btn" }, "+", {
          click: this.onAddTask
        }),
      ]),

      createElement("ul", { id: "todos" }, 
      this.state.tasks.map((task, index) => 
        createElement("li", {}, [
          createElement("input", { 
            type: "checkbox", 
            ...(task.completed ? { checked: "true" } : {})
          }, null, {
            change: () => this.onToggleTask(index)
          }),

          createElement("label", { 
            style: task.completed ? "color: gray;" : "" 
          }, task.text),

          createElement("button", {}, "🗑️", {
            click: () => this.onDeleteTask(index)
          })
        ])
      )
    )
    ]);
  }

  //     createElement("ul", { id: "todos" }, [
  //       createElement("li", {}, [
  //         createElement("input", { type: "checkbox" }),
  //         createElement("label", {}, "Сделать домашку"),
  //         createElement("button", {}, "🗑️")
  //       ]),
  //       createElement("li", {}, [
  //         createElement("input", { type: "checkbox" }),
  //         createElement("label", {}, "Сделать практику"),
  //         createElement("button", {}, "🗑️")
  //       ]),
  //       createElement("li", {}, [
  //         createElement("input", { type: "checkbox" }),
  //         createElement("label", {}, "Пойти домой"),
  //         createElement("button", {}, "🗑️")
  //       ]),
  //     ]),
  //   ]);
  // }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
