import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Trash2, Edit } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [filterTodos,setFilterTodos] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3000/list")
      .then((res) => res.json())
      .then((data) => { setTodos(data) })
  }, [])

  const addTodo = () => {
    if (!input.trim()) return;
    let todo = {
      id: Date.now(),
      text: input,
      completed: false,
      important: false,
    }
    setTodos([
      ...todos,
      todo
    ]);
    setInput("");

    fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo)
    })
  };

  const deleteAll = () => {
    setTodos([])
    fetch('http://localhost:3000/all', {
      method: "DELETE",
      headers: { "Accept": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => { console.log(data.message) })
      .catch((err) => { console.log(err) })
  }

  const toggleComplete = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    fetch(`http://localhost:3000/complete/${id}`, {
      method: "PUT",
      headers: { "Accept": "application/json" }
    }).then((res) => res.json())
      .then((data) => { console.log(data.message) })
      .catch((err) => { console.log(err) })
  };

  const toggleImportant = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, important: !t.important } : t)));
    fetch(`http://localhost:3000/important/${id}`, {
      method: "PUT",
      headers: { "Accept": "application/json" }
    }).then((res) => res.json())
      .then((data) => { console.log(data.message) })
      .catch((err) => { console.log(err) })
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
    fetch(`http://localhost:3000/${id}`, {
      method: "DELETE",
      headers: { "Accept": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => { console.log(data.message) })
      .catch((err) => { console.log(err) })
  };

  const saveEdit = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editingText } : t)));
    setEditingId(null);
    setEditingText("");
    fetch(`http://localhost:3000/text/${id}/${editingText}`, {
      method: "PUT",
      headers: { "Accept": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => { console.log(data.message) })
      .catch((err) => { console.log(err) })
  };

  const handleHideCompleted = () => {
    setHideCompleted(!hideCompleted)
  }


  const filterImportant = () => {
    setFilterTodos(!filterTodos)
   }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 flex flex-col items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/40"
      >
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6 text-center">
          Todo App
        </h1>

        {/* Input Box */}
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 p-3 rounded-xl border border-white/50 bg-white/60 backdrop-blur-md placeholder-gray-600 text-black"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={deleteAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
          >
            Delete All
          </button>
        </div>
        <div className="mb-3 flex justify-around">
          <div onClick={handleHideCompleted}>
            <label className="text-white" htmlFor="completed">Hide Completed:</label>
            <input type="checkbox" id="completed" className="mx-1 relative top-0.5" />
          </div>
          <div onClick={filterImportant}>
            <label className="text-white" htmlFor="imporant">Filter important:</label>
            <input type="checkbox" id="important" className="mx-1 relative top-0.5" />
          </div>
        </div>

        {/* Todo List */}
        <div className="flex flex-col gap-4">
          {todos.length === 0 && (
            <p className="text-center text-white/80 text-lg">No tasks yet! </p>
          )}

          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${filterTodos && (!todo.important && "hidden")} w-full p-4 rounded-xl shadow-lg flex items-center justify-between backdrop-blur-xl border 
              ${todo.completed ? hideCompleted ? "hidden" : "bg-green-300/40 border-green-200" : "bg-white/60 border-white/50"}`}
            >
              {/* Left side */}
              <div className="flex items-center gap-3 flex-1">
                <button onClick={() => toggleComplete(todo.id)}>
                  <Check className={`w-6 h-6 ${todo.completed ? "text-green-700" : "text-gray-600"}`} />
                </button>

                {editingId === todo.id ? (
                  <input
                    className="flex-1 p-2 rounded-lg border"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                  />
                ) : (
                  <p
                    className={`flex-1 text-lg font-medium ${todo.completed ? "line-through text-gray-600" : "text-black"}`}
                  >
                    {todo.text}
                  </p>
                )}
              </div>

              {/* Right side buttons */}
              <div className="flex items-center gap-3">
                {editingId === todo.id ? (
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="mx-2 px-2 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.text);
                    }}
                  >
                    <Edit className="w-6 h-6 text-blue-600" />
                  </button>
                )}

                <button onClick={() => toggleImportant(todo.id)}>
                  <Star
                    className={`w-6 h-6 ${todo.important ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                  />
                </button>

                <button onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="w-6 h-6 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
