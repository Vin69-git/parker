// src/components/BookingConfirmation.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Layout.css';

function BookingConfirmation() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const bookingId = localStorage.getItem('booking_id');
      const response = await api.get(`/booking-details/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBooking(response.data);
      console.log(response.data);
    };
    fetchBooking();
  }, []);

  return (
    <div className="container">
      <h2>Booking Confirmation</h2>
      {booking ? (
        <div className="booking-details">
          <p><strong>Mall:</strong> {booking.mall}</p>
          <p><strong>Slot Number:</strong> {booking[0].slot_id}</p>
          <p><strong>Booked At:</strong> {new Date(booking.user_id).toLocaleString()}</p>
          <button className="button" onClick={() => (window.location.href = '/exit')}>
            Mark as Exited
          </button>
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}
    </div>
  );
}

export default BookingConfirmation;
