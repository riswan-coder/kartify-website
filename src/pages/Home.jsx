import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getShops } from '../api/shops';
import { getProducts } from '../api/products';
import { getPopupAd, getBannerAds } from '../api/ads';

const COLORS = [
  '#4f46e5', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#7c3aed',
];

export default function Home() {
  const [shops, setShops] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [popupAd, setPopupAd] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getShops(),
      getProducts({ ordering: '-created_at' }),,
      getBannerAds(),
      getPopupAd(),
    ]).then(([shopsRes, productsRes, bannersRes, popupRes]) => {
      setShops(shopsRes.data);
      setFeaturedProducts(productsRes.data.slice(0, 10));
      if (Array.isArray(bannersRes.data) && bannersRes.data.length > 0) {
        setBannerAds(bannersRes.data);
      }
      if (popupRes.data && popupRes.data.image_url) {
        setPopupAd(popupRes.data);
        const adShown = sessionStorage.getItem('adShown');
        if (!adShown) {
          setTimeout(() => {
            setShowPopup(true);
            sessionStorage.setItem('adShown', 'true');
          }, 1500);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (bannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % bannerAds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerAds]);

  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">

      {/* Popup Ad */}
      {showPopup && popupAd && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: '#000000', borderRadius: 20,
            overflow: 'hidden', width: '100%', maxWidth: 360,
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10
              }}
            >✕</button>
            <Link to={`/shop/${popupAd.shop?.id}`} onClick={() => setShowPopup(false)}>
              <img
                src={popupAd.image_url}
                alt="Ad"
                style={{
                  width: '100%', maxHeight: 320,
                  objectFit: 'cover', display: 'block'
                }}
              />
            </Link>
            <div style={{
              padding: '12px 16px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ fontWeight: 600, color: '#ffffff',  fontSize: 14, margin: 0 }}>
                  {popupAd.shop?.name}
                </p>
                <p style={{ color: '#ffffff', fontSize: 12, margin: 0 }}>
                  {popupAd.shop?.city}
                </p>
              </div>
              <Link
                to={`/shop/${popupAd.shop?.id}`}
                onClick={() => setShowPopup(false)}
                style={{
                  background: '#a70000', color: '#fff',
                  padding: '8px 16px', borderRadius: 20,
                  textDecoration: 'none', fontSize: 13, fontWeight: 500
                }}
              >Visit</Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: '#010105',
        padding: '10px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>

        {/* App name row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}>
        </div>

        {/* Search products button */}
        <Link
          to="/products"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '10px 14px',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 14 }}>🛍️</span>
          <span style={{
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
            flex: 1,
          }}>Browse all products</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>›</span>
        </Link>

        {/* Search shops */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#c6c6ca',
          borderRadius: 8,
          padding: '10px 14px',
        }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#111827',
              background: 'transparent',
            }}
          />
        </div>


      </div>

      {/* Main content */}
      <div className="main-content">

        {/* Banner Ads */}
        {bannerAds.length > 0 && (
          <div className="banner-wrapper">
            <div className="banner-container">
              {bannerAds.map((ad, index) => (
                <Link
                  key={ad.id}
                  to={`/shop/${ad.shop?.id}`}
                  className="banner-slide"
                  style={{ opacity: currentBanner === index ? 1 : 0 }}
                >
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.shop?.name} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: '#4f46e5',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <p style={{ color: '#fff', fontWeight: 600 }}>
                        {ad.shop?.name}
                      </p>
                    </div>
                  )}
                  <div className="banner-overlay">
                    <p className="banner-shop-name">{ad.shop?.name}</p>
                    <p className="banner-shop-city">{ad.shop?.city}</p>
                  </div>
                </Link>
              ))}
            </div>
            {bannerAds.length > 1 && (
              <div className="banner-dots">
                {bannerAds.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`banner-dot ${currentBanner === i ? 'active' : ''}`}
                    style={{ width: currentBanner === i ? 20 : 6 }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gender filter */}
        <div className="gender-filter">
          {[
            { key: 'men', label: '👔 Men', color: '#a50505' },
            { key: 'women', label: '👗 Women', color: '#aa0202' },
            { key: 'kids', label: '🧒 Kids', color: '#ad0202' },
          ].map(g => (
            <button
              key={g.key}
              className="gender-btn"
              onClick={() => navigate(`/category/${g.key}`)}
              style={{
                background: g.color,
                boxShadow: `0 3px 8px ${g.color}55`
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Local shops */}
        <div className="section-header">
          <span className="section-title">Local Shops</span>
          <span className="section-count">{filteredShops.length} shops</span>
        </div>

        {loading ? (
          <div className="shop-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                height: 110, background: '#f1f5f9'
              }} />
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: '#9ca3af', background: '#fff',
            borderRadius: '0 0 8px 8px', marginBottom: 16
          }}>
            <p style={{ fontSize: 40 }}>🏪</p>
            <p>No shops found</p>
          </div>
        ) : (
          <div className="shop-grid">
            {filteredShops.map((shop, index) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                className="shop-card"
              >
                <div
                  className="shop-card-img"
                  style={{ background: COLORS[index % COLORS.length] }}
                >
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.name} />
                  ) : (
                    <span style={{
                      color: '#fff', fontSize: 24, fontWeight: 700
                    }}>
                      {shop.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="shop-card-body">
                  <p className="shop-card-name">{shop.name}</p>
                  <p className="shop-card-city">{shop.city}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Products */}
        <div className="section-header" style={{ marginTop: 8 }}>
          <span className="section-title">Featured Products</span>
          <Link to="/products" style={{
            color: '#4f46e5', fontSize: 13,
            fontWeight: 500, textDecoration: 'none'
          }}>
            View all →
          </Link>
        </div>

        <div className="featured-grid">
          {featuredProducts.slice(0, 10).map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: '100%',
                  height: 150,
                  minHeight: 150,
                  maxHeight: 150,
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {product.images?.[0]?.image ? (
                    <img
                      src={product.images[0].image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 6,
                        display: 'block',
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 44 }}>
                      {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                    </span>
                  )}
                </div>
                <div style={{
                  padding: '8px 10px',
                  height: 70,
                  minHeight: 70,
                  maxHeight: 70,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{product.name}</p>
                  <p style={{
                    fontSize: 10,
                    color: '#9ca3af',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{product.shop_name}</p>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#4f46e5',
                    margin: 0,
                  }}>₹{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div style={{ padding: '0 14px 24px', textAlign: 'center' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '13px',
              background: '#4f46e5',
              color: '#fff',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            View All Products →
          </Link>
        </div>

        <div style={{ height: 24 }} />

      </div>
    </div>
  );
}