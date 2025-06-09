import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/ContactUs.css'; // Optional for more custom styles

function ContactUs() {
  return (
    <div className="contact-us-section bg-dark text-white py-5" style={{ width: '100%', padding: '0' }}>
      <Container fluid>
        {/* Header */}
        <Row className="mb-4 text-center">
          <Col>
            <h2>Contact Us</h2>
            <p>We'd love to hear from you! Reach out with any questions, feedback, or just to say hello.</p>
          </Col>
        </Row>

        {/* Contact Details */}
        <Row className="text-center text-md-start d-flex justify-content-center">
          <Col md={4} className="mb-4 d-flex justify-content-center">
            <div>
              <h5>DL Food Products</h5>
              <p>Your trusted partner in the kitchen and for better living.</p>
            </div>
          </Col>

          <Col md={4} className="mb-4 d-flex justify-content-center">
            <div>
              <h5>Contact Details</h5>
              <p className="mb-2 d-flex align-items-center">
                <i className="bi bi-envelope-fill me-2" style={{ fontSize: '1.1rem' }}></i>
                <a href="mailto:contact.dlfoods@gmail.com" className="text-white text-decoration-none">
                  contact.dlfoods@gmail.com
                </a>
              </p>

              <p>
                <i className="bi bi-telephone-fill me-2"></i>
                +91 95003 37355
              </p>
              <p>
                <i className="bi bi-geo-alt-fill me-2"></i>
                123 Spice Street, Chennai, India
              </p>
            </div>
          </Col>

          <Col md={4} className="d-flex justify-content-center">
            <div className="text-center">
              <h5>Follow Us</h5>
              <p>
                <a href="https://www.instagram.com/dl_foodproducts" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                  <i className="bi bi-instagram"></i> Instagram
                </a>
                <br />
                <a href="https://www.facebook.com/dl_foodproducts" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="bi bi-facebook"></i> Facebook
                </a>
              </p>
            </div>
          </Col>
        </Row>

        <hr className="border-top border-light my-4" />

        {/* Footer */}
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} DL Food Products. All rights reserved.</small>
          </Col>
        </Row>
      </Container>

      {/* Bootstrap Icons CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />
    </div>
  );
}

export default ContactUs;
