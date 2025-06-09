import { useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import '../styles/Navbar.css';
import { useUser } from '../contexts/userContext.jsx';

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const scrollToSection = (id) => {
    if (location.pathname === '/') {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img
            src="/assets/logo.jpg"
            width="65"
            height="65"
            className="d-inline-block align-top"
            alt="DL Logo"
          />
        </Navbar.Brand>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          DL Food Products
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/products')}>Products</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('about-us')}>About</Nav.Link>
            <Nav.Link onClick={() => scrollToSection('contact-us')}>Contact Us</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {user && (
                <Nav.Link onClick={() => navigate('/cart')} className="me-2">
                  <i className="bi bi-cart3" style={{ fontSize: '1.2rem' }}></i> Cart
                </Nav.Link>
            )}

            {user ? (
              <NavDropdown title={user.name || 'Account'} id="account-dropdown" align="end">
                <NavDropdown.Item onClick={() => navigate('/profile')}>My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                variant="warning"
                className="login-button"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
