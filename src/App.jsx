import { useReducer, useState, useEffect } from "react";
import { todoReducer } from "./tool/todo_reducer";
import "./App.css";

function init() {
  try {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, [], init);
  const [filter, setFilter] = useState("All");
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() === "") return;

    dispatch({
      type: "ADD",
      payload: {
        id: crypto.randomUUID(),
        text: input.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      },
    });

    setInput("");
  }

  function editTodo(todo) {
    setEditId(todo.id);
    setEditInput(todo.text);
  }

  function saveEdit() {
    if (editInput.trim() === "") return;

    dispatch({
      type: "EDIT",
      payload: {
        id: editId,
        text: editInput.trim(),
      },
    });

    setEditId(null);
    setEditInput("");
  }

  function cancelEdit() {
    setEditId(null);
    setEditInput("");
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.done;
    if (filter === "Completed") return todo.done;
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.done).length;

  return (
    <div className="container">
      <h1>My Todo List</h1>
      <p className="subtitle">Keep track of your daily tasks.</p>

      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Enter a task..."
        />

        <button className="add-btn" onClick={addTodo}>
          ➕ Add Task
        </button>
      </div>

      <div className="filter-tabs">
        {["All", "Active", "Completed"].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active-tab" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredTodos.length === 0 ? (
        <p className="empty-message">
          {filter === "All" && "No tasks yet. Add your first task!"}
          {filter === "Active" && "No active tasks! You're all caught up."}
          {filter === "Completed" && "No tasks yet completed."}
        </p>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              {editId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  />

                  <div className="todo-actions">
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className={todo.done ? "todo-text completed" : "todo-text"}>
                    {todo.text}
                  </h3>

                  <div className="todo-actions">
                    <button onClick={() => editTodo(todo)}>Edit</button>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE",
                          payload: todo.id,
                        })
                      }
                    >
                      {todo.done ? "Undo" : "Complete"}
                    </button>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "DELETE",
                          payload: todo.id,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="todo-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{remainingCount} items left</span>
        <button
          type="button"
          className="clear-btn"
          onClick={() => dispatch({ type: "CLEAR_DONE" })}
        >
          Clear 🧹
        </button>
      </div>
    </div>
  );
}

export default App;