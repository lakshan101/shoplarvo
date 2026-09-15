import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/Layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import AdminPortal from './pages/AdminPortal';
import SupplierManagement from './pages/SupplierManagement';
import DeliveryDashboard from './pages/DeliveryDashboard';

// Customer Authentication Screens
import Login from './epics/E1_CustomerManagement/Login';
import Register from './epics/E1_CustomerManagement/Register';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Customer Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />

              {/* Admin & Staff Portal */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <AdminPortal />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/suppliers" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <SupplierManagement />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/delivery-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['delivery_manager', 'admin', 'staff']}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
