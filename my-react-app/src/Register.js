import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        email
      });

      if (response.data.success) {
        setSuccessMessage('Registration successful! Please log in.');
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate('/login'); // เปลี่ยนเส้นทางไปยังหน้า login
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />

      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}

      {successMessage && (
        <Typography color="primary" variant="body1">
          {successMessage}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleRegister}>
        Register
      </Button>

      <Button variant="outlined" color="secondary" onClick={handleLogin} style={{ marginLeft: '10px' }}>
        Login
      </Button>
    </Container>
  );
};

export default Register;