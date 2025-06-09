import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import '../styles/Carousels.css';
import { useNavigate } from 'react-router-dom';

function CarouselSlides() {
  
  const navigate = useNavigate();  // Initialize navigate
  const images = [
    {
      src: "/assets/chilli_caro.jpg",
      label: "Chilli Powder",
      text: "Freshly ground and rich in flavor, our chilli powder is perfect for all your recipes.",
      additionalContent: [
        "Chilli powder adds spice and heat to dishes.",
        "It is packed with antioxidants, vitamins, and minerals.",
        "Can be used in cooking, baking, or as a garnish."
      ],
    },
    {
      src: "/assets/moring_caro.jpg",
      label: "Moringa Powder",
      text: "Packed with nutrients, Moringa is a superfood to boost your daily health.",
      additionalContent: [
        "Moringa is rich in vitamins A, C, and E.",
        "It supports healthy blood sugar levels.",
        "It has anti-inflammatory properties."
      ],
    },
    {
      src: "/assets/nutri_caro.jpg",
      label: "Nutri Mix",
      text: "A blend of essential grains and pulses for a wholesome diet.",
      additionalContent: [
        "Provides a balanced source of carbohydrates, protein, and fiber.",
        "Perfect for making smoothies, bowls, or snacks.",
        "Supports digestion and overall health."
      ],
    },
    {
      src: "/assets/turmeric_caro.jpg",
      label: "Turmeric Powder",
      text: "Organic turmeric rich in curcumin for healing and immunity.",
      additionalContent: [
        "Turmeric is known for its anti-inflammatory properties.",
        "Curcumin in turmeric has antioxidant effects.",
        "Can be used in curries, teas, and smoothies."
      ],
    },
  ];

  const groupedImages = [];
  for (let i = 0; i < images.length; i += 2) {
    groupedImages.push(images.slice(i, i + 2));
  }

  return (
    <div
      style={{
        width: '100vw',
        backgroundColor: '#fffaf0',
        paddingTop: '2rem',
        paddingBottom: '1rem',
      }}
    >
      {/* Heading above carousel */}
      <h2 className="text-center mb-4" style={{ color: "#d2691e" }}>
        Our Latest Products
      </h2>
  
      {/* Carousel container */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Carousel
          interval={3000}
          pause="hover"
          controls={true}
          indicators={false}
          nextIcon={<span aria-hidden="true" style={{ fontSize: '2rem', color: '#d4af37' }}>›</span>}
          prevIcon={<span aria-hidden="true" style={{ fontSize: '2rem', color: '#d4af37' }}>‹</span>}
          ride="carousel"
          style={{ width: '100%' }}
        >
          {groupedImages.map((group, index) => (
            <Carousel.Item key={index}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: '2rem',
                  padding: '1rem 4rem',
                  maxHeight: '50vh',
                }}
              >
                {group.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '1rem',
                      height: '100%',
                      backgroundColor: '#fff',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Image */}
                    <div style={{ flex: 1 }}>
                      <img
                        className="d-block w-100"
                        src={img.src}
                        alt={img.label}
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
  
                    {/* Text */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        height: '100%',
                      }}
                    >
                      <h4>{img.label}</h4>
                      <p>{img.text}</p>
                      {img.additionalContent.map((content, i) => (
                        <p key={i} style={{ marginBottom: '0.3rem' }}>{content}</p>
                      ))}
                      <Button
                          variant="warning"
                          style={{ marginTop: '0.5rem' }}
                          onClick={() => navigate('/products')}
                        >
                          Buy Now
                    </Button>

                    </div>
                  </motion.div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
  
}

export default CarouselSlides;
