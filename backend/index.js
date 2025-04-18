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

// Example route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
