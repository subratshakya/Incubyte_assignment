import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div className="card" style={{ maxWidth: '450px', width: '90%', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px', animation: 'bounce 2s infinite' }}>🎂</div>
          <h2 style={{ 
            marginBottom: '8px', 
            textAlign: 'center', 
            color: '#d63384',
            fontSize: '32px',
            fontFamily: "'Fredoka One', cursive",
            background: 'linear-gradient(135deg, #ff6b9d 0%, #d63384 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Create Account
          </h2>
          <p style={{ color: '#666', fontSize: '14px', fontWeight: 600 }}>Join our sweet community! 🍭</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⏳ Registering...' : '✨ Register'}
          </button>
        </form>
        <p style={{ marginTop: '24px', textAlign: 'center', fontWeight: 600, color: '#666' }}>
          Already have an account? <Link to="/login" style={{ 
            color: '#ff6b9d', 
            fontWeight: 700,
            textDecoration: 'none',
            borderBottom: '2px solid #ffb6c1',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#d63384';
            e.currentTarget.style.borderBottomColor = '#ff6b9d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#ff6b9d';
            e.currentTarget.style.borderBottomColor = '#ffb6c1';
          }}
          >Login here 🚀</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

