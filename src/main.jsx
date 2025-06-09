// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // You can add global styles here
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);