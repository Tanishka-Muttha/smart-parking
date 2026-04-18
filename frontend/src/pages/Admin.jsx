import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config';

export default function Admin() {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user.isAdmin) navigate('/dashboard');
  }, []);

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get(`${API}/api/slots`);  // ← replaced
      setSlots(data);
    } catch (err) {
      showMsg('Failed to load slots', 'error');
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const showMsg = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const addSlot = async () => {
    if (!slotNumber.trim()) {
      showMsg('Please enter a slot number', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/slots`, { slotNumber: slotNumber.trim() }, { headers });  // ← replaced
      setSlotNumber('');
      showMsg(`✅ Slot "${slotNumber}" added successfully`);
      fetchSlots();
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to add slot'), 'error');
    }
    setLoading(false);
  };

  const deleteSlot = async (id, slotNum) => {
    if (!window.confirm(`Delete slot "${slotNum}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/slots/${id}`, { headers });  // ← replaced
      showMsg(`✅ Slot "${slotNum}" deleted`);
      fetchSlots();
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to delete'), 'error');
    }
  };

  const addMultipleSlots = async () => {
    const count = parseInt(prompt('How many slots to add? (e.g. 10)'));
    if (!count || count < 1 || count > 50) return;
    const prefix = prompt('Enter prefix (e.g. A, B, or P)') || 'P';
    setLoading(true);
    let added = 0;
    for (let i = 1; i <= count; i++) {
      const num = String(i).padStart(2, '0');
      try {
        await axios.post(`${API}/api/slots`, { slotNumber: `${prefix}-${num}` }, { headers });  // ← replaced
        added++;
      } catch {}
    }
    showMsg(`✅ Added ${added} slots with prefix "${prefix}"`);
    fetchSlots();
    setLoading(false);
  };

  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.isBooked).length;
  const freeSlots = totalSlots - bookedSlots;

  return (
    <div className="container">
      <h2 className="page-title">⚙️ Admin Panel</h2>
      <div className="stats-row">
        <div className="stat-card">
          <div className="number">{totalSlots}</div>
          <div className="label">Total Slots</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#38a169' }}>{freeSlots}</div>
          <div className="label">Available</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#e53e3e' }}>{bookedSlots}</div>
          <div className="label">Occupied</div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#1a365d', fontSize: '1rem' }}>
          ➕ Add New Slot
        </h3>
        <div className="admin-form">
          <input
            placeholder="Slot number (e.g. A-01, B-02, P-01)"
            value={slotNumber}
            onChange={e => setSlotNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSlot()}
          />
          <button className="btn-primary" onClick={addSlot} disabled={loading}>
            {loading ? 'Adding...' : 'Add Slot'}
          </button>
          <button className="btn-primary" onClick={addMultipleSlots} disabled={loading}
            style={{ background: '#2d3748' }}>
            Bulk Add Slots
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '8px' }}>
          💡 Tip: Use "Bulk Add" to add many slots at once (e.g. A-01 to A-10)
        </p>
      </div>

      {msg && (
        <p className={msgType === 'success' ? 'success' : 'error'}
          style={{ marginBottom: '16px', fontWeight: '600' }}>{msg}</p>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Slot Number</th><th>Status</th>
              <th>Booked By</th><th>Booking Time</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {slots.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
                No slots added yet. Add your first slot above!
              </td></tr>
            ) : slots.map((slot, i) => (
              <tr key={slot._id}>
                <td>{i + 1}</td>
                <td><strong>{slot.slotNumber}</strong></td>
                <td><span className={`badge ${slot.isBooked ? 'cancelled' : 'active'}`}>
                  {slot.isBooked ? '🔴 Booked' : '🟢 Free'}
                </span></td>
                <td>{slot.bookedBy?.name || '—'}</td>
                <td>{slot.bookingTime ? new Date(slot.bookingTime).toLocaleString() : '—'}</td>
                <td>
                  <button className="delete-btn"
                    onClick={() => deleteSlot(slot._id, slot.slotNumber)}
                    disabled={slot.isBooked}
                    style={{ opacity: slot.isBooked ? 0.4 : 1,
                      cursor: slot.isBooked ? 'not-allowed' : 'pointer' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}