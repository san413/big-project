import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Declare state variables
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  // Fetch data from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => {
        setData(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []); // Runs only once

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:5000/api/greet', { name })
      .then(response => {
        setGreeting(response.data.message);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed })
      .then(() => fetchTodos());
  };
  
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => fetchTodos());
  }; 
  
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => setTodos(response.data));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    axios.post('http://localhost:5000/api/todos', { title: newTodo })
      .then(() => {
        setNewTodo('');
        fetchTodos();
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Display data from GET request */}
        <h1>Data from Backend:</h1>
        <p>{data ? data : 'Loading...'}</p>

        {/* Greeting Form */}
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

        {/* Display Greeting */}
        {greeting && <p>{greeting}</p>}

        {/* To-Do List */}
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
      </header>
    </div>
  );
}

export default App;
