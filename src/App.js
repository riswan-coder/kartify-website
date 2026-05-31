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

// Global responsive styles
const globalStyle = `
  * { box-sizing: border-box; }

  /* Mobile first — single column */
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* Card fixed heights */
  .shop-card-img {
    height: 70px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-card-img {
    height: 160px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
  }

  .product-card-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
  }

  .shop-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Banner ad responsive */
  .banner-container {
    height: 180px;
    margin: 12px 14px 0;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  /* Laptop — limit max width and center */
  @media (min-width: 768px) {
    .page-wrapper {
      max-width: 480px;
      margin: 0 auto;
    }

    .banner-container {
      height: 220px;
    }

    .shop-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .product-card-img {
      height: 180px;
    }
  }

  /* Large screens */
  @media (min-width: 1024px) {
    .page-wrapper {
      max-width: 500px;
    }
  }
`;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <style>{globalStyle}</style>
        <Toaster position="top-right" />
        <Navbar />
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
      </BrowserRouter>
    </AuthProvider>
  );
}