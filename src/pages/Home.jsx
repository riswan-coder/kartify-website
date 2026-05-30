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
      getProducts({}),
      getBannerAds(),
      getPopupAd(),
    ]).then(([shopsRes, productsRes, bannersRes, popupRes]) => {
      setShops(shopsRes.data);
      setFeaturedProducts(productsRes.data.slice(0, 8));
      if (Array.isArray(bannersRes.data) && bannersRes.data.length > 0) {
        setBannerAds(bannersRes.data);
      }
      if (popupRes.data && popupRes.data.image_url) {
        setPopupAd(popupRes.data);
        setTimeout(() => setShowPopup(true), 1500);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Auto scroll banner every 5 seconds
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
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Popup Ad */}
      {showPopup && popupAd && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            overflow: 'hidden', width: '100%', maxWidth: 360,
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10
              }}
            >✕</button>
            <Link
              to={`/shop/${popupAd.shop?.id}`}
              onClick={() => setShowPopup(false)}
            >
              <img
                src={popupAd.image_url}
                alt="Ad"
                style={{
                  width: '100%', maxHeight: 300,
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
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  {popupAd.shop?.name}
                </p>
                <p style={{ color: '#9ca3af', fontSize: 12, margin: 0 }}>
                  {popupAd.shop?.city}
                </p>
              </div>
              <Link
                to={`/shop/${popupAd.shop?.id}`}
                onClick={() => setShowPopup(false)}
                style={{
                  background: '#4f46e5', color: '#fff',
                  padding: '8px 16px', borderRadius: 20,
                  textDecoration: 'none', fontSize: 13, fontWeight: 500
                }}
              >Visit</Link>
            </div>
          </div>
        </div>
      )}

      {/* Purple header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        padding: '48px 16px 16px',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {/* Search products */}
        <Link
          to="/products"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12, padding: '12px 16px',
            textDecoration: 'none', marginBottom: 10,
          }}
        >
          <span>🔍</span>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, flex: 1 }}>
            Search products...
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }}>›</span>
        </Link>

        {/* Search shops */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 12, padding: '10px 16px',
        }}>
          <span>🏪</span>
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'transparent',
              border: 'none', outline: 'none',
              color: '#fff', fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Banner Ads — full width scroll */}
      {bannerAds.length > 0 && (
        <div style={{ margin: '12px 14px 0' }}>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            height: 160, position: 'relative',
            background: '#4f46e5'
          }} className="home-banner">
            {bannerAds.map((ad, index) => (
              <Link
                key={ad.id}
                to={`/shop/${ad.shop?.id}`}
                style={{
                  position: 'absolute', inset: 0,
                  opacity: currentBanner === index ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                  display: 'block', textDecoration: 'none'
                }}
              >
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.shop?.name}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: '#4f46e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <p style={{ color: '#fff', fontWeight: 600 }}>
                      {ad.shop?.name}
                    </p>
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '20px 14px 10px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.65))'
                }}>
                  <p style={{
                    color: '#fff', fontWeight: 700, fontSize: 14, margin: 0
                  }}>
                    {ad.shop?.name}
                  </p>
                  <p style={{
                    color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0
                  }}>
                    {ad.shop?.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots indicator */}
          {bannerAds.length > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: 6, marginTop: 8
            }}>
              {bannerAds.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  style={{
                    width: currentBanner === i ? 20 : 6,
                    height: 6, borderRadius: 3,
                    background: currentBanner === i ? '#4f46e5' : '#d1d5db',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease', padding: 0
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gender filter — SINGLE ROW 3 buttons only */}
      <div style={{
        display: 'flex', gap: 10,
        padding: '14px 14px 6px',
      }}>
        {[
          { key: 'men', label: '👔 Men', color: '#4f46e5' },
          { key: 'women', label: '👗 Women', color: '#4f46e5' },
          { key: 'kids', label: '🧒 Kids', color: '#4f46e5' },
        ].map(g => (
          <button
            key={g.key}
            onClick={() => navigate(`/category/${g.key}`)}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 12,
              border: 'none',
              background: g.color,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 3px 8px ${g.color}55`,
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 14px 0' }}>

        {/* Local shops */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 10
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
            Local shops
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
            {filteredShops.length} shops
          </p>
        </div>

        {/* Shops grid 3 per row */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: 8
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: 110, borderRadius: 12,
                background: '#f1f5f9'
              }} />
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 40 }}>🏪</p>
            <p>No shops found</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8, marginBottom: 20
          }}>
            {filteredShops.map((shop, index) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff', borderRadius: 12,
                  overflow: 'hidden', border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    height: 64,
                    background: COLORS[index % COLORS.length],
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', overflow: 'hidden'
                  }}>
                    {shop.logo_url ? (
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{
                        color: '#fff', fontSize: 24, fontWeight: 700
                      }}>
                        {shop.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 8 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 600, color: '#111827',
                      margin: 0, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {shop.name}
                    </p>
                    <p style={{
                      fontSize: 10, color: '#9ca3af',
                      margin: '2px 0 0', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {shop.city}
                    </p>
                    <p style={{
                      fontSize: 10, color: '#4f46e5',
                      margin: '2px 0 0', fontWeight: 500
                    }}>
                      {shop.product_count} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured products */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 12
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Featured Products
            </p>
            <Link to="/products" style={{
              color: '#4f46e5', fontSize: 13,
              fontWeight: 500, textDecoration: 'none'
            }}>
              View all →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10
          }}>
            {featuredProducts.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff', borderRadius: 12,
                  overflow: 'hidden', border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    height: 130, background: '#eef2ff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', overflow: 'hidden'
                  }}>
                    {product.images?.[0]?.image ? (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 48 }}>
                        {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: '#111827',
                      margin: 0, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </p>
                    <p style={{
                      fontSize: 11, color: '#9ca3af', margin: '2px 0'
                    }}>
                      {product.shop_name}
                    </p>
                    <p style={{
                      fontSize: 15, fontWeight: 700, color: '#4f46e5', margin: 0
                    }}>
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}