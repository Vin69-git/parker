// src/components/OTPVerification.js
import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Form.css';

function OTPVerification({ email }) {
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const response = await api.post('/verify-otp', { email, otp });
      localStorage.setItem('token', response.data.jwtToken);
      alert('Login successful!');
      window.location.href = '/malls';
    } catch (error) {
      alert('Invalid OTP, please try again.');
    }
  };

  return (
    <div className="container">
      <h2>OTP Verification</h2>
      <div className="form-group">
        <label>Enter OTP</label>
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
      </div>
      <button onClick={handleVerifyOtp}>Verify OTP</button>
    </div>
  );
}

export default OTPVerification;
