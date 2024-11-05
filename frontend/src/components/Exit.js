// src/components/Exit.js
import React from 'react';
import api from '../services/api';
import '../styles/Layout.css';

function Exit() {
  const handleExit = async () => {
    const bookingId = localStorage.getItem('booking_id');
    try {
      await api.delete('/unbook-slot', {
        data: { id: bookingId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });      
      alert('You have successfully exited the parking slot.');
      localStorage.removeItem('booking_id');
      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + error.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Exit Parking</h2>
      <p>Press the button below to mark your slot as empty.</p>
      <button className="button" onClick={handleExit}>
        Exit Parking
      </button>
    </div>
  );
}

export default Exit;
