import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Form.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/register', { name, email, password, phone_number: phone });
      alert('User registered successfully!');
      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + error.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
