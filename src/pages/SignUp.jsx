import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { GoogleLogin } from '@react-oauth/google';

// Import the user context hook to update user state globally
import { useUser } from '../contexts/userContext.jsx';  // Adjust path as needed

const images = [
  "/assets/chilli_caro.jpg",
  "/assets/moring_caro.jpg",
  "/assets/nutri_caro.jpg",
  "/assets/turmeric_caro.jpg",
];

function Signup() {
  const [currentImage, setCurrentImage] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Get setUser from UserContext to update user globally
  const { setUser } = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const apiUrl = "https://dl-food-products.onrender.com/api/v1/auth/sign-up";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Signup failed");
        return;
      }

      // On successful signup, update user context and localStorage if your backend returns user info and token
      const userObj = data.data?.User || data.data?.user;
      const token = data.data?.token;

      if (userObj && token) {
        setUser(userObj);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Google login failed');
        return;
      }

      // Extract user object and token safely
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

// ... existing imports and component logic ...

    return (
      <div className="login-page">
        <div
          className="left-panel"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
          }}
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
            <h2>Create a new account</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
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
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <button type="submit" className="login-button">Sign Up</button>

              <div
                style={{
                  textAlign: 'center',
                  margin: '0.8rem 0',
                  fontWeight: 'bold',
                  color: '#888',
                }}
              >
                or
              </div>

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
            {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

            <div className="auth-links">
              <p>
                Already have an account? <NavLink to="/login">Log In</NavLink>
              </p>
            </div>

            {/* Back to Home Button */}
            <div className="back-button-container">
              <NavLink to="/" className="back-button">
                ← Back to Home
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );

}

export default Signup;
