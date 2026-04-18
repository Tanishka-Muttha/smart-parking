import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../config';

export default function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSlots = async () => {
   const { data } = await axios.get(`${API}/api/slots`);
    setSlots(data);
  };

  useEffect(() => { fetchSlots(); }, []);

  const bookSlot = async (slotId) => {
    try {
      await axios.post(`${API}/api/bookings/book`, { slotId: slot._id }, { headers });
      setMsg('✅ Slot booked successfully!');
      fetchSlots();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Booking failed'));
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const available = slots.filter(s => !s.isBooked).length;
  const booked = slots.filter(s => s.isBooked).length;

  return (
    <div className="container">
      <h2 className="page-title">Parking Dashboard</h2>

      <div className="stats-row">
        <div className="stat-card">
          <div className="number">{slots.length}</div>
          <div className="label">Total Slots</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#38a169' }}>{available}</div>
          <div className="label">Available</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#e53e3e' }}>{booked}</div>
          <div className="label">Occupied</div>
        </div>
      </div>

      {msg && <p className={msg.startsWith('✅') ? 'success' : 'error'}>{msg}</p>}

      <div className="legend">
        <span><div className="dot green"></div> Available (click to book)</span>
        <span><div className="dot red"></div> Occupied</span>
      </div>

      <div className="slots-grid">
        {slots.map(slot => (
          <div
            key={slot._id}
            className={`slot-card ${slot.isBooked ? 'booked' : 'available'}`}
            onClick={() => !slot.isBooked && bookSlot(slot._id)}
          >
            <div className="slot-icon">{slot.isBooked ? '🔴' : '🟢'}</div>
            <div className="slot-number">{slot.slotNumber}</div>
            <div className="slot-status">{slot.isBooked ? 'Occupied' : 'Available'}</div>
          </div>
        ))}
        {slots.length === 0 && (
          <p style={{ color: '#718096', gridColumn: '1/-1' }}>No slots added yet. Ask admin.</p>
        )}
      </div>
    </div>
  );
}