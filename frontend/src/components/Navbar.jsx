import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav>
      <h1>🅿 Smart Parking</h1>
      {token && (
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">My Bookings</Link>
          {user.isAdmin && <Link to="/admin">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}