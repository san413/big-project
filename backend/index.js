const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors()); // Enable CORS to allow requests from the frontend

// New POST route to create a greeting with a name
app.post('/api/greet', (req, res) => {
  const { name } = req.body;  // Get the 'name' from the request body
  res.json({ message: `Hello, ${name}!` });
});

// Example route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
