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
      </header>
    </div>
  );
}

export default App;
