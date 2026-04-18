import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../config';

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchHistory = async () => {
   const { data } = await axios.get(`${API}/api/bookings/history`, { headers });
// and
    setBookings(data);
  };

  useEffect(() => { fetchHistory(); }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.post(`${API}/api/bookings/cancel`, { bookingId }, { headers });
      setMsg('✅ Booking cancelled');
      fetchHistory();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Failed'));
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="container">
      <h2 className="page-title">My Booking History</h2>
      {msg && <p className={msg.startsWith('✅') ? 'success' : 'error'}>{msg}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Slot</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#718096' }}>No bookings yet</td></tr>
            ) : bookings.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td><strong>{b.slotId?.slotNumber || 'N/A'}</strong></td>
                <td>{new Date(b.bookingDate).toLocaleString()}</td>
                <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                <td>
                  {b.status === 'active' && (
                    <button className="cancel-btn" onClick={() => cancelBooking(b._id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}