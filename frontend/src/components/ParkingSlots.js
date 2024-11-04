// src/components/ParkingSlots.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Layout.css';

function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      const mallId = localStorage.getItem('selectedMall');
      const response = await api.get(`/available-slots/${mallId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSlots(response.data);
    };
    fetchSlots();
  }, []);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmBooking = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    try {
      const response =await api.post(
        '/book-slot',
        {
          slot_id: selectedSlot.id,
          vehicle_number: vehicleNumber,
          user_id: localStorage.getItem('user_id') // Assume user_id is stored in local storage
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Slot booked successfully!');
      const bookingId = response.data.id;
      localStorage.setItem('booking_id', bookingId);
      window.location.href = '/confirmation';
    } catch (error) {
      alert('Error: ' + (error.response?.data || 'An unexpected error occurred'));
    }
  };
  

  return (
    <div className="container">
      <h2>Select a Parking Slot</h2>
      <div className="slots-grid">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={`slot ${slot.isOccupied ? 'occupied' : ''}`}
            onClick={() => handleSlotSelect(slot)}
            disabled={slot.isOccupied}
          >
            {slot.id}
          </button>
        ))}
      </div>
      <form onSubmit={confirmBooking}>
      {selectedSlot && (
        <>
        <input required type='text' 
        value={vehicleNumber} 
        onChange={(e) => setVehicleNumber(e.target.value)}
         placeholder="Enter Vehicle Number" 
         />
        <button className="button" type='submit'>
          Confirm Booking for Slot {selectedSlot.id}
        </button>
        </>
      )}
      </form>
    </div>
  );
}

export default ParkingSlots;
