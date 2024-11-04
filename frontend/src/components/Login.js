import React, { useState } from 'react';
import api from '../services/api';
import OTPVerification from './OTPVerification';
import '../styles/Form.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async () => {
    try {
      await api.post('/login', { email, password });
      setOtpSent(true);
      setUserEmail(email);
    } catch (error) {
      alert('Error: ' + error.response.data);
    }
  };

  return otpSent ? (
    <OTPVerification email={userEmail} />
  ) : (
    <div className="container">
      <h2>Login</h2>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
