export function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload);

    case "TOGGLE":
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });

    case "EDIT":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, text: action.payload.text };
        }
        return todo;
      });

    case "CLEAR_DONE":
      return state.filter((todo) => !todo.done);

    default:
      return state;
  }
}