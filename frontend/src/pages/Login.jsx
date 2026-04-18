import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back 👋</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>No account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}