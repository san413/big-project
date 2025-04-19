const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors()); // Enable CORS to allow requests from the frontend
app.use(bodyParser.json());

// Sample in-memory task list (you can use a database later)
let todos = [];
let users = []; // ✅ Add this line here

// 🆕 Create a new task
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  const newTodo = { id: Date.now(), title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 📄 Get all tasks
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// New POST route to create a greeting with a name
app.post('/api/greet', (req, res) => {
  const { name } = req.body;  // Get the 'name' from the request body
  res.json({ message: `Hello, ${name}!` });
});

// ✅ Update a task (e.g., mark as completed)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find(t => t.id == id);
  if (todo) {
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// 🗑️ Delete a task
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id != id);
  res.status(204).send(); // No content
});

// 📝 Register a new user
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Add new user to memory
  const newUser = { id: Date.now(), username, password }; // NOTE: No hashing for now
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// 🔐 Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
});

// Example route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
