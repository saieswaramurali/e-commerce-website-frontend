import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/login.css'; // same style as ForgotPassword

const images = [
  "/assets/chilli_caro.jpg",
  "/assets/moring_caro.jpg",
  "/assets/nutri_caro.jpg",
  "/assets/turmeric_caro.jpg",
];

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      return setError("Both fields are required!");
    }

    if (password !== confirm) {
      return setError("Passwords do not match!");
    }

    try {
      setLoading(true);
      const res = await fetch('https://dl-food-products.onrender.com/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      toast.success("Password updated successfully!");
      navigate('/login');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
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
          src="/assets/logo.jpg" 
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
          <p className="info-text">Enter and confirm your new password below.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
