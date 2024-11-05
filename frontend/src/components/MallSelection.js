import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Layout.css';

function MallSelection() {
  const [malls, setMalls] = useState([]);

  useEffect(() => {
    const fetchMalls = async () => {
      const response = await api.get('/malls', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMalls(response.data);
      console.log(response.data);
    };
    fetchMalls();
  }, []);

  const handleMallSelect = (mallId) => {
    localStorage.setItem('selectedMall', mallId);
    window.location.href = '/slots';
  };

  return (
    <div className="container">
      <h2>Select a Mall</h2>
      {malls.map((mall) => (
        <button key={mall.id} className="mall-button" onClick={() => handleMallSelect(mall.id)}>
          {mall.name}
        </button>
      ))}
    </div>
  );
}

export default MallSelection;
