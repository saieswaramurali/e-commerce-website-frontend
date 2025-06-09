import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom'; // ← NEW

import { useUser } from '../contexts/userContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductComponents() {
  const { user } = useUser();  // Get logged-in user
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://dl-food-products.onrender.com/api/v1/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const getImagePath = (name) => {
    const fileName = name.toLowerCase().replace(/\s+/g, '_') + '.jpg';
    return `/products/${fileName}`;
  };

  const handleAddToCart = async (productId) => {
    if (!user || !user._id) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await fetch(
        `https://dl-food-products.onrender.com/api/v1/products/${user._id}/add-to-cart`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: 1 }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add to cart.');
    }
  };

  const renderProductCard = (product, index) => (
    <motion.div
      key={product._id || index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <div style={{ flex: 1, maxHeight: '350px' }}>
        <img
          src={getImagePath(product.name)}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h4 style={{ marginBottom: '1rem', color: '#A0522D' }}>{product.name}</h4>
        <p>{product.description}</p>
        <ul>
          {product.keyPoints?.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outline-warning"
            onClick={() => {
              if (user) {
                handleAddToCart(product._id);
              } else {
                window.location.href = '/login';
              }
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const firstRow = products.slice(0, 2);
  const secondRow = products.slice(2, 4);

  return (
    <div style={{ backgroundColor: '#fffaf0', padding: '3rem 2rem' }}>
      <h2 className="text-center mb-5" style={{ color: "#8B0000" }}>
        Explore Our Products
      </h2>

      {/* First Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {firstRow.map(renderProductCard)}
      </div>

      {/* Second Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {secondRow.map(renderProductCard)}
      </div>

      {/* View More Button using NavLink */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} style={{ textAlign: 'center' }}>
        <NavLink to="/products" style={{ textDecoration: 'none' }}>
          <Button
            variant="gradient"
            style={{
              background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
              color: '#fff',
              border: 'none',
              marginTop: '2rem',
              fontWeight: 'bold',
              padding: '0.6rem 2rem',
            }}
          >
            View More Products
          </Button>
        </NavLink>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default ProductComponents;
