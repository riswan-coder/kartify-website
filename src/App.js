import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Category from './pages/Category';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        {/* This wrapper centers content and limits width on laptop */}
        <div style={{
          maxWidth: 480,
          margin: '0 auto',
          minHeight: '100vh',
          background: '#f8fafc',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order/:id" element={<PlaceOrder />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/:gender" element={<Category />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}