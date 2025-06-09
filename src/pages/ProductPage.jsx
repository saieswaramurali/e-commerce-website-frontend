import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/Navbar';
import { useUser } from '../contexts/userContext';
import ContactUs from '../components/ContactUs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductPage() {
  const { user } = useUser();
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

  // Add to cart handler (no quantity input, just add 1 each time)
  const handleAddToCart = async (productId) => {
    if (!user || !user._id) {
      toast.info("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await fetch(`https://dl-food-products.onrender.com/api/v1/products/${user._id}/add-to-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

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

  return (
    <>
      <NavigationBar />
      <div style={{ backgroundColor: '#fffaf0', padding: '3rem 2rem' }}>
        <h2 className="text-center mb-5" style={{ color: "#8B0000" }}>
          Our Full Product Range
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div style={{ flex: 1, maxHeight: '250px' }}>
                <img
                  src={getImagePath(product.name)}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ marginBottom: '1rem', color: '#A0522D' }}>
                  {product.name}
                </h4>
                <p>{product.description}</p>
                <ul style={{ paddingLeft: '1.2rem', flexGrow: 1 }}>
                  {product.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
                <Button
                  variant="outline-warning"
                  style={{ marginTop: '1rem', alignSelf: 'start' }}
                  onClick={() => {
                    if (user) {
                      handleAddToCart(product._id);
                    } else {
                      window.location.href = '/login'; // redirect to login if not logged in
                    }
                  }}
                >
                  {user ? 'Add to Cart' : 'Buy Now'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ContactUs />
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
    </>
  );
}

export default ProductPage;
