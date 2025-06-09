import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../contexts/userContext.jsx';  // Adjust path if needed

const images = [
  "/assets/chilli_caro.jpg",
  "/assets/moring_caro.jpg",
  "/assets/nutri_caro.jpg",
  "/assets/turmeric_caro.jpg",
];

function Login() {
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch("https://dl-food-products.onrender.com/api/v1/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const userObj = data.data?.User || data.data?.user;

      if (userObj && data.data?.token) {
        setUser(userObj);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(userObj));
        navigate('/');
      } else {
        setError("Invalid login response.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await fetch('https://dl-food-products.onrender.com/api/v1/auth/google-sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Google login failed');
        return;
      }

      const userObj = data.data?.user || data.data?.User;
      const token = data.data?.token;

      if (userObj && token) {
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError('Invalid Google login response.');
      }
    } catch (err) {
      console.error('Error calling Google sign-in API:', err);
      setError('Google login failed. Try again.');
    }
  };

  return (
    <div className="login-page">
      <div
        className="left-panel"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      ></div>

      <div className="right-panel">
              <img 
          src="assets/logo.jpg" 
          alt="Logo" 
          style={{ 
            display: 'block', 
            margin: '0 auto 20px', 
            maxWidth: '150px', 
            height: 'auto' 
          }} 
        />
        <div className="login-box">
          <h2>Login to your account</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>

            <p><NavLink to="/forgot-password">Forgot password?</NavLink></p>

            <button type="submit" className="login-button">Log In</button>

            <div style={{
              textAlign: 'center',
              margin: '0.8rem 0',
              fontWeight: 'bold',
              color: '#888'
            }}>or</div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Google Login Failed');
                  setError('Google login failed');
                }}
              />
            </div>
          </form>

          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

          <div className="auth-links">
            <p><NavLink to="/forgot-password">Forgot password?</NavLink></p>
            <p>Don't have an account? <NavLink to="/signup">Create New</NavLink></p>
          </div>
        </div>

        {/* Centered Back to Home Button */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <NavLink
            to="/"
            style={{
              textDecoration: 'none',
              fontWeight: '500',
              color: '#555',
              border: '1px solid #ccc',
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#f9f9f9',
              transition: '0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => e.target.style.background = '#eee'}
            onMouseLeave={(e) => e.target.style.background = '#f9f9f9'}
          >
            ← Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Login;
