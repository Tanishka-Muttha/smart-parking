import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account 🚗</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <p>Already registered? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}