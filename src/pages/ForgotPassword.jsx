import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/login.css';

const images = [
  "/assets/chilli_caro.jpg",
  "/assets/moring_caro.jpg",
  "/assets/nutri_caro.jpg",
  "/assets/turmeric_caro.jpg",
];

function ForgotPassword() {
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 👈 loading state

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendResetLink = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true); // 👈 Start loading

    try {
      const response = await fetch('https://dl-food-products.onrender.com/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong.");
        }

      toast.success(data.message || "Reset link sent to your email!");
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error: unexpected response format");
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

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
          <h2>Reset your password</h2>
          <p className="info-text">Enter your registered email address to receive a reset link.</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="login-button" onClick={handleSendResetLink} disabled={loading}>
            {loading ? (
              <>
                Sending...
                <span className="spinner" style={{
                  marginLeft: '8px',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite'
                }}></span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="back-button-container">
            <NavLink to="/" className="back-button">
              ← Back to Home
            </NavLink>
          </div>
        </div>
      </div>

      {/* Spinner animation style */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;
