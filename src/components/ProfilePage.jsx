import React, { useEffect, useState } from 'react';
import { Card, Table, Container, Row, Col } from 'react-bootstrap';
import NavigationBar from './Navbar.jsx';
import { useUser } from '../contexts/userContext.jsx';  // Adjust path as needed
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { user } = useUser();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    name,
    email,
    shippingAddress: userShippingAddress,
  } = user || {};

  // Extract shipping address from recent orders if userShippingAddress is not present
  const getShippingAddressFromOrders = () => {
    const ordersToCheck = [...currentOrders, ...pastOrders];
    for (const order of ordersToCheck) {
      if (order.shippingAddress) {
        return order.shippingAddress;
      }
    }
    return null;
  };

  const shippingAddress = userShippingAddress || getShippingAddressFromOrders();

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://dl-food-products.onrender.com/api/v1/orders/${user._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();

        setCurrentOrders(data.currentOrders || []);
        setPastOrders(data.pastOrders || []);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const renderOrderItemsTable = (orderItems) => (
    <Table striped bordered hover size="sm" className="mb-3 mt-2">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Price (₹)</th>
          <th>Quantity</th>
          <th>Subtotal (₹)</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.price * item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <NavigationBar />
      <Container style={{ marginTop: '2rem' }}>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header><strong>Profile Info</strong></Card.Header>
              <Card.Body>
                <div><strong>Name:</strong> {name || 'N/A'}</div>
                <div><strong>Email:</strong> {email || 'N/A'}</div>
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header><strong>Shipping Address</strong></Card.Header>
              <Card.Body>
                {shippingAddress ? (
                        <>
                          <div><strong>Address Line 1:</strong> {shippingAddress.addressLine1}</div>
                          <div><strong>Address Line 2:</strong> {shippingAddress.addressLine2 || 'N/A'}</div>
                          <div><strong>City:</strong> {shippingAddress.city}</div>
                          <div><strong>State:</strong> {shippingAddress.state || 'N/A'}</div>
                          <div><strong>Postal Code:</strong> {shippingAddress.postalCode}</div>
                          <div><strong>Country:</strong> {shippingAddress.country}</div>
                        </>
                ) : (
                  <div>No shipping address set.</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card>
              <Card.Header><strong>Current Orders</strong></Card.Header>
              <Card.Body>
                {loading ? (
                  <div>Loading orders...</div>
                ) : error ? (
                  <div>Error: {error}</div>
                ) : currentOrders.length > 0 ? (
                  currentOrders.map(order => {
                    const items = order.orderItems || order.items || [];
                    const totalAmount = items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );

                    return (
                      <div key={order._id || order.id} className="mb-4 p-3 border rounded">
                        <div><strong>Order #{order._id || order.id}</strong></div>
                        <div>Status: {order.isDelivered ? 'Delivered' : 'Pending'}</div>
                        <div>Date: {new Date(order.createdAt || order.date).toLocaleDateString()}</div>
                        {renderOrderItemsTable(items)}
                        <div><strong>Total: ₹{totalAmount}</strong></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No current orders.</div>
                )}
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header><strong>Past Orders</strong></Card.Header>
              <Card.Body>
                {loading ? (
                  <div>Loading orders...</div>
                ) : error ? (
                  <div>Error: {error}</div>
                ) : pastOrders.length > 0 ? (
                  pastOrders.map(order => {
                    const items = order.orderItems || order.items || [];
                    const totalAmount = items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );

                    return (
                      <div key={order._id || order.id} className="mb-4 p-3 border rounded">
                        <div><strong>Order #{order._id || order.id}</strong></div>
                        <div>Status: Delivered</div>
                        <div>Date: {new Date(order.createdAt || order.date).toLocaleDateString()}</div>
                        {renderOrderItemsTable(items)}
                        <div><strong>Total: ₹{totalAmount}</strong></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No past orders.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProfilePage;
