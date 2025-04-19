import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [user, setUser] = useState(null);

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch greeting data
  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => setData(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Fetch todos
  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Submit greeting
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/greet', { name })
      .then(response => setGreeting(response.data.message))
      .catch(error => console.error('Error submitting greeting:', error));
  };

  // Handle auth (login/register)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = authMode === 'register' ? '/api/register' : '/api/login';

    axios.post(`http://localhost:5000${endpoint}`, {
      username: authUsername,
      password: authPassword
    })
    .then(res => {
      setAuthMessage(res.data.message);
      if (res.data.user) {
        setUser(res.data.user);
        setAuthMessage(`Welcome, ${res.data.user.username}`);
        setAuthUsername('');
        setAuthPassword('');
      }
    })
    .catch(err => {
      setAuthMessage(err.response?.data?.message || 'Something went wrong.');
    });
  };

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    axios.post('http://localhost:5000/api/todos', { title: newTodo })
      .then(() => {
        setNewTodo('');
        fetchTodos();
      });
  };

  // Toggle complete
  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed })
      .then(() => fetchTodos());
  };

  // Delete todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => fetchTodos());
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Backend Data */}
        <h1>Data from Backend:</h1>
        <p>{data || 'Loading...'}</p>

        {/* Greeting */}
        <h2>Greeting Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Get Greeting</button>
        </form>
        {greeting && <p>{greeting}</p>}

        {/* Auth Form */}
        <h2>{authMode === 'register' ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleAuthSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={authUsername}
            onChange={(e) => setAuthUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />
          <button type="submit">
            {authMode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <p>
          {authMode === 'register' ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>
            {authMode === 'register' ? 'Login here' : 'Register here'}
          </button>
        </p>

        {/* Auth Info */}
        {authMessage && <p>{authMessage}</p>}
        {user && (
          <div>
            <p>Logged in as: {user.username}</p>
            <button onClick={() => setUser(null)}>Logout</button>
          </div>
        )}

        {/* To-Do Section */}
        {user && (
          <>
            <h2>To-Do List</h2>
            <form onSubmit={addTodo}>
              <input
                type="text"
                placeholder="Add new task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button type="submit">Add Task</button>
            </form>

            <ul>
              {todos.map(todo => (
                <li key={todo.id}>
                  <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.title}
                  </span>
                  <button onClick={() => toggleComplete(todo.id, todo.completed)}>
                    {todo.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
