import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getShopDetail } from '../api/shops';
import { getProducts } from '../api/products';


export default function ShopDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get('ref') === 'direct';
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter ] = useState('all');

  useEffect(() => {
    Promise.all([getShopDetail(id), getProducts({ shop: id })])
      .then(([shopRes, productsRes]) => {
        setShop(shopRes.data);
        setProducts(productsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = products.filter(p => {
    const words = search.toLowerCase().split(' ').filter(w => w);
    const matchSearch = words.length === 0 || words.every(word =>
      p.name?.toLowerCase().includes(word) ||
      p.colors?.toLowerCase().includes(word) ||
      p.description?.toLowerCase().includes(word)
    );
    const matchFilter =
      activeFilter === 'all' ||
      p.category?.gender === activeFilter ||
      p.category?.product_type === activeFilter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', minHeight: 300
      }}>
        <div style={{
          width: 36, height: 36, border: '3px solid #4f46e5',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div>

      {/* Shop header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        padding: '48px 16px 20px'
      }}>
        {isDirect ? (
          <button
            onClick={() => window.close()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', padding: '6px 14px', borderRadius: 20,
              fontSize: 13, cursor: 'pointer', marginBottom: 12
            }}
          >
            ✕ Close
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', padding: '6px 14px', borderRadius: 20,
              fontSize: 13, cursor: 'pointer', marginBottom: 12
            }}
          >
            ← Back
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 18, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {shop?.logo_url ? (
              <img
                src={shop.logo_url}
                alt={shop.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>
                {shop?.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>
              {shop?.name}
            </p>
            <p style={{ color: '#c7d2fe', fontSize: 13, margin: '3px 0 0' }}>
              {shop?.city} · {shop?.phone}
            </p>
            {shop?.category && (
              <span style={{
                display: 'inline-block', marginTop: 6,
                background: 'rgba(255,255,255,0.2)', color: '#fff',
                padding: '3px 12px', borderRadius: 20, fontSize: 11
              }}>
                {shop.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>
        </div>

        {isDirect && (
          <div style={{
            marginTop: 12, background: 'rgba(255,255,255,0.15)',
            borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span>🏪</span>
            <div>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 500, margin: 0 }}>
                Welcome to {shop?.name}
              </p>
              <p style={{ color: '#c7d2fe', fontSize: 12, margin: 0 }}>
                Browse and order below
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 0' }}>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px',
          border: '1px solid #e5e7eb', marginBottom: 10
        }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, color: '#111827'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none',
                color: '#9ca3af', cursor: 'pointer', fontSize: 14
              }}
            >✕</button>
          )}
        </div>

        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
          {filtered.length} products
        </p>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 40 }}>👕</p>
            <p>No products found</p>
          </div>
        ) : (
          <div className="shopdetail-grid">
            {filtered.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}${isDirect ? '?ref=direct&shop=' + id : ''}`}
                className="shopdetail-card"
              >
                <div className="shopdetail-img">
                  {product.images?.[0]?.image ? (
                    <img
                      src={product.images[0].image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                    />
                  ) : (
                    <span style={{ fontSize: 48 }}>
                      {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                    </span>
                  )}
                </div>
                <div className="shopdetail-body">
                  <p className="shopdetail-name">{product.name}</p>
                  {product.colors && (
                    <p className="shopdetail-colors">{product.colors}</p>
                  )}
                  <p className="shopdetail-price">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {isDirect && (
          <div style={{
            textAlign: 'center', padding: '16px 0 24px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <p style={{ color: '#9ca3af', fontSize: 12, margin: 0 }}>Powered by</p>
            <Link to="/" style={{ color: '#4f46e5', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
              TrendKart
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}