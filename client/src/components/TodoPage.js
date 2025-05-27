import { useEffect, useState } from 'react';
import axios from 'axios';
import './todopage.css'; // import the CSS

function TodoPage() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/auth/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => window.location.href = '/');

    axios.get('http://localhost:5000/api/todos', { withCredentials: true })
      .then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post('http://localhost:5000/api/todos', { text }, { withCredentials: true });
    setTodos([...todos, res.data]);
    setText('');
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText }, { withCredentials: true });
    setTodos(todos.map(t => (t._id === id ? res.data : t)));
    setEditId(null);
    setEditText('');
  };

  const toggleCompleted = async (todo) => {
    const res = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, { completed: !todo.completed }, { withCredentials: true });
    setTodos(todos.map(t => (t._id === todo._id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`, { withCredentials: true });
    setTodos(todos.filter(t => t._id !== id));
  };

const logout = () => {
  window.open('http://localhost:5000/auth/logout', '_self');
};


  if (!user) return <p>Loading...</p>;

  const completedCount = todos.filter(todo => todo.completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2>Welcome back, {user.name}</h2>
          <p>{completedCount} of {todos.length} tasks completed</p>
        </div>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="summary">
        <div className="card total"><p>Total Tasks</p><p>{todos.length}</p></div>
        <div className="card completed"><p>Completed</p><p>{completedCount}</p></div>
        <div className="card remaining"><p>Remaining</p><p>{remainingCount}</p></div>
      </div>

      <div className="add-task">
        <h3>+ Add New Task</h3>
        <div className="input-group">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button onClick={addTodo}>+ Add Task</button>
        </div>
      </div>

      <div className="task-list">
        <h3>Your Tasks</h3>
        {todos.map(todo => (
          <div key={todo._id} className={`task-item ${todo.completed ? 'done' : ''}`}>
            <div className="left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo)}
              />
              {editId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
              ) : (
                <span onDoubleClick={() => startEdit(todo)}>{todo.text}</span>
              )}
            </div>
            <div className="right">
              {editId === todo._id ? (
                <>
                  <button onClick={() => saveEdit(todo._id)} className="save">Save</button>
                  <button onClick={cancelEdit} className="cancel">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(todo)} className="edit">Edit</button>
                  <button onClick={() => deleteTodo(todo._id)} className="delete">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoPage;
