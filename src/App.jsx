import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ProfilePage from './components/ProfilePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Cart from './pages/Cart.jsx';
// import SellerLogin from './pages/SellerSideLogin.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   
import 'bootstrap-icons/font/bootstrap-icons.css';


import { UserProvider } from './contexts/userContext.jsx';

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <UserProvider>
        <Router>
          {/* ToastContainer can be placed here at the root */}
          <ToastContainer 
            position="top-center"
            autoClose={2000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
          />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart/>}/>
            {/* <Route path="/seller-login" element={<SellerLogin />} /> */}

          </Routes>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;


// update the order with phone number -> clear the cart once you have done the order -> show the order in the profile both past and current 
// perform the changes in the contact form -> only address and mail is left 
// detail about the products make it good 
// integrate the payment-gateway 
// make sure of authorization middleware 
// once the order is placed send email about the details of the order to the customer
// enable Arcjet bot protection 
// host carefully with the env variable hidden. 
