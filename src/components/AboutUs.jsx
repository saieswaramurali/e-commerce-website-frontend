import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/AboutUs.css';

const cardVariants = {
  hiddenLeft: { opacity: 0, x: -100 },
  hiddenRight: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

function AboutUs() {
  return (
    <Container fluid className="about-us-section px-5">
      <Row className="text-center my-5">
        <Col className="px-md-5">
          <h1 className="display-4">About Us</h1>
          <p className="lead">
            At <strong>DL Food Products</strong>, we are passionate about providing you with the finest, handpicked ingredients to elevate your culinary experiences. Our mission is to offer a range of high-quality, natural food products that nourish the body and enrich every meal.
          </p>
        </Col>
      </Row>

      <Row className="my-4 d-flex justify-content-center">
        <Col md={8}>
          <motion.div
            variants={cardVariants}
            initial="hiddenLeft"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="shadow-lg border-0 hover-zoom-card mb-4">
              <Card.Body>
                <Card.Title><strong>What We Offer</strong></Card.Title>
                <ul>
                  <li><strong>Chili Powder</strong>: A perfect blend of heat and flavor for every dish.</li>
                  <li><strong>Moringa Powder</strong>: A superfood packed with vitamins, minerals, and antioxidants.</li>
                  <li><strong>Nutri Mix</strong>: A wholesome blend of grains and pulses for a healthy, balanced diet.</li>
                  <li><strong>Turmeric Powder</strong>: Rich in curcumin, this organic spice offers healing and anti-inflammatory properties.</li>
                </ul>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="my-4 d-flex justify-content-center">
        <Col md={8}>
          <motion.div
            variants={cardVariants}
            initial="hiddenRight"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="shadow-lg border-0 hover-zoom-card mb-4">
              <Card.Body>
                <Card.Title><strong>Our Promise</strong></Card.Title>
                <Card.Text>
                  We are committed to sourcing ingredients that are not only delicious but also packed with essential nutrients. We believe in the power of nature to enhance well-being, which is why our products are all-natural, non-GMO, and free from preservatives.
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="my-4 d-flex justify-content-center">
        <Col md={8}>
          <motion.div
            variants={cardVariants}
            initial="hiddenLeft"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="shadow-lg border-0 hover-zoom-card mb-4">
              <Card.Body>
                <Card.Title><strong>Our Values</strong></Card.Title>
                <Card.Text>
                  We take pride in every product we offer, focusing on sustainability, transparency, and quality. Our team is dedicated to making sure that each item we sell meets the highest standards, and we are constantly innovating to bring you new, exciting products that promote health and flavor.
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="text-center my-5">
        <Col>
          <h2>Thank you for choosing <strong>DL Food Products</strong> — your trusted partner in the kitchen and for better living!</h2>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;
