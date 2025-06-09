import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/goldenTheme.css";
import NavigationBar from "../components/Navbar.jsx";
import { Country, State } from "country-state-city";

const API_BASE_URL = "https://dl-food-products.onrender.com/api/v1/";

const getImagePath = (name) => {
  if (!name) return "https://via.placeholder.com/80";
  const fileName = name.toLowerCase().replace(/\s+/g, "_") + ".jpg";
  return `/products/${fileName}`;
};

const CartBootstrap = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryCode: "",
    phoneNumber: "",
  });

  const [savedAddress, setSavedAddress] = useState(null);

  const fetchCartFromBackend = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}products/cart/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      const mappedCart = data.cart.map((item) => ({
        id: item._id,
        name: item.product?.name || "Unnamed Product",
        size: item.product?.size || "N/A",
        quantity: item.quantity,
        price: item.product?.offerPrice || item.product?.price || 0,
        offerPrice: item.product?.offerPrice || 0,
        image: getImagePath(item.product?.name),
      }));
      setCartItems(mappedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchCartFromBackend(user._id);
    } else {
      setCartItems([]);
    }
    setCountries(Country.getAllCountries());
  }, [user]);

  const updateCartItemBackend = async (userId, itemId, quantity) => {
    const response = await fetch(`${API_BASE_URL}products/${userId}/cart-item/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update cart item");
    return await response.json();
  };

  const removeCartItemBackend = async (userId, itemId) => {
    const response = await fetch(`${API_BASE_URL}products/${userId}/cart-item/${itemId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
    return await response.json();
  };

  const handleQtyChange = async (index, qty) => {
    if (qty < 1) qty = 1;
    const item = cartItems[index];
    try {
      await updateCartItemBackend(user._id, item.id, qty);
      const updated = [...cartItems];
      updated[index].quantity = qty;
      setCartItems(updated);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const decrementQty = (index) => {
    const newQty = cartItems[index].quantity - 1;
    if (newQty >= 1) handleQtyChange(index, newQty);
  };

  const incrementQty = (index) => {
    handleQtyChange(index, cartItems[index].quantity + 1);
  };

  const handleRemove = async (index) => {
    const item = cartItems[index];
    try {
      await removeCartItemBackend(user._id, item.id);
      setCartItems(cartItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const country = Country.getCountryByCode(code);
    setSelectedAddress({ ...selectedAddress, country: country.name, countryCode: code, state: "" });
    setStates(State.getStatesOfCountry(code));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSelectedAddress({ ...selectedAddress, [name]: value });
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation: must be digits, 7 to 15 digits long (international)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleAddressSave = () => {
    if (!validatePhoneNumber(selectedAddress.phoneNumber)) {
      alert("Please enter a valid phone number (10 digits, numbers only).");
      return;
    }
    setSavedAddress(selectedAddress);
    setShowAddress(false);
  };

  const clearCartBackend = async (userId) => {
    const response = await fetch(`https://dl-food-products.onrender.com/api/v1/products/${userId}/clear`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to clear cart");
    }

    return await response.json();
  };

  const placeOrder = async () => {
    if (!user || !user._id) {
      alert("Please log in to place an order.");
      return;
    }
    if (!savedAddress) {
      alert("Please provide a delivery address.");
      return;
    }
    if (!validatePhoneNumber(savedAddress.phoneNumber)) {
      alert("Please provide a valid phone number.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const itemsPrice = cartItems.reduce((acc, item) => {
        const price = item.offerPrice || item.price || 0;
        return acc + price * item.quantity;
      }, 0);

      const taxPrice = +(itemsPrice * 0.1).toFixed(2); // Example 10% tax
      const shippingPrice = itemsPrice > 500 ? 0 : 50; // Example shipping cost
      const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

      const orderPayload = {
        user: user._id,
        orderItems: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          size: item.size || "",
          quantity: item.quantity,
          price: item.price,
          offerPrice: item.offerPrice || undefined,
        })),
        shippingAddress: {
          addressLine1: savedAddress.addressLine1 || "",
          addressLine2: savedAddress.addressLine2 || "",
          city: savedAddress.city || "",
          state: savedAddress.state || "",
          postalCode: savedAddress.postalCode || "",
          country: savedAddress.country || "",
          phoneNumber: savedAddress.phoneNumber || "",
        },
        paymentMethod: "Cash On Delivery",
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      console.log("Order Payload:", JSON.stringify(orderPayload, null, 2));

      const response = await fetch("https://dl-food-products.onrender.com/api/v1/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      await response.json();
      await clearCartBackend(user._id);
      setShowToast(true);
      setCartItems([]);
      setSavedAddress(null);

      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;

  return (
    <>
      <NavigationBar />
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-8">
            <h3 className="mb-4 gold-text">
              Shopping Cart <small className="text-muted">({cartItems.length} items)</small>
            </h3>
            {loading && cartItems.length === 0 ? (
              <p>Loading cart...</p>
            ) : cartItems.length > 0 ? (
              <ul className="list-group mb-3">
                {cartItems.map((item, index) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="d-flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-thumbnail"
                        style={{ width: "80px", height: "80px", objectFit: "contain" }}
                      />
                      <div>
                        <h6 className="fw-semibold mb-1">{item.name}</h6>
                        <p className="mb-1 text-muted">Size: {item.size}</p>
                        <p className="mb-1 gold-text fw-bold">₹{item.price.toFixed(2)}</p>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Qty:</span>
                          <div className="input-group input-group-sm" style={{ width: "110px" }}>
                            <button
                              className="btn btn-outline-gold"
                              onClick={() => decrementQty(index)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.quantity}
                              min={1}
                              onChange={(e) =>
                                handleQtyChange(index, parseInt(e.target.value) || 1)
                              }
                              aria-label="Quantity"
                            />
                            <button
                              className="btn btn-outline-gold"
                              onClick={() => incrementQty(index)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold gold-text">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        className="btn btn-sm btn-outline-gold mt-2"
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <button
              className="btn btn-link text-decoration-none gold-text"
              onClick={() => navigate("/products")}
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3 gold-text">Order Summary</h5>

                <div className="mb-3">
                  <label className="form-label fw-bold">Delivery Address</label>
                  {savedAddress ? (
                    <div className="mb-2">
                      <p className="mb-1">{savedAddress.addressLine1}</p>
                      <p className="mb-1">
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}
                      </p>
                      <p className="mb-1">{savedAddress.country}</p>
                      <p className="mb-1">Phone: {savedAddress.phoneNumber}</p>
                    </div>
                  ) : (
                    <p className="text-muted">No address saved.</p>
                  )}
                  <button
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => setShowAddress(!showAddress)}
                  >
                    {showAddress ? "Cancel" : savedAddress ? "Change Address" : "Add Address"}
                  </button>
                </div>

                {showAddress && (
                  <div className="bg-light p-3 rounded">
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      value={selectedAddress.addressLine1}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="addressLine2"
                      placeholder="Address Line 2"
                      value={selectedAddress.addressLine2}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="city"
                      placeholder="City"
                      value={selectedAddress.city}
                      onChange={handleAddressChange}
                    />
                    <select
                      className="form-select mb-2"
                      value={selectedAddress.countryCode}
                      onChange={handleCountryChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-select mb-2"
                      name="state"
                      value={selectedAddress.state}
                      onChange={handleAddressChange}
                      disabled={!states.length}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={selectedAddress.postalCode}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      name="phoneNumber"
                      placeholder="Phone Number (10 digits)"
                      value={selectedAddress.phoneNumber}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        if (digitsOnly.length <= 10) {
                          setSelectedAddress({ ...selectedAddress, phoneNumber: digitsOnly });
                        }
                      }}
                      maxLength={10}
                      inputMode="numeric"
                    />

                    <button
                      className="btn btn-sm btn-gold w-100"
                      onClick={handleAddressSave}
                      disabled={
                        !selectedAddress.addressLine1 ||
                        !selectedAddress.city ||
                        !selectedAddress.state ||
                        !selectedAddress.postalCode ||
                        !selectedAddress.country ||
                        !selectedAddress.phoneNumber
                      }
                    >
                      Save Address
                    </button>
                  </div>
                )}

                <hr />
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span className="gold-text">₹{subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Tax (2%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span className="gold-text">₹{total.toFixed(2)}</span>
                  </li>
                </ul>
                <button
                  className="btn btn-gold w-100"
                  disabled={cartItems.length === 0 || loading}
                  onClick={placeOrder}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1055 }}
          >
            <div className="toast show align-items-center text-bg-success border-0">
              <div className="d-flex">
                <div className="toast-body">Order placed successfully!</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setShowToast(false)}
                  aria-label="Close"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartBootstrap;
