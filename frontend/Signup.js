import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/register', { email, password })
      .then(response => {
        alert('Signup Successful');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
