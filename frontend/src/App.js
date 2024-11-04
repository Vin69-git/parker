// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register';
import MallSelection from './components/MallSelection';
import ParkingSlots from './components/ParkingSlots';
import BookingConfirmation from './components/BookingConfirmation';
import Exit from './components/Exit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/malls" element={<MallSelection />} />
        <Route path="/slots" element={<ParkingSlots />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/exit" element={<Exit />} />
      </Routes>
    </Router>
  );
}

export default App;
