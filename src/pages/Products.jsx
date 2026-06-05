import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [type, setType] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (gender) params.gender = gender;
      if (type) params.type = type;
      const res = await getProducts(params);
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }, [search, gender, type]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #000000, #a70000)',
        padding: '48px 16px 20px'
      }}>
        <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
          Search Products
        </p>
      </div>

      <div style={{ padding: '14px 14px 0' }}>

        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '11px 14px',
          border: '2px solid #000000', marginBottom: 12
        }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, color, size..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
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
                color: '#f3f3f3f6', cursor: 'pointer', fontSize: 16
              }}
            >✕</button>
          )}
        </div>

        {/* Gender filter */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 8,
          overflowX: 'auto', scrollbarWidth: 'none'
        }}>
          {[
            { key: '', label: 'All' },
            { key: 'men', label: '👔 Men' },
            { key: 'women', label: '👗 Women' },
            { key: 'kids', label: '🧒 Kids' },
          ].map(g => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              style={{
                flexShrink: 0, padding: '7px 16px',
                borderRadius: 20, fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                border: gender === g.key ? 'none' : '1px solid #000000',
                background: gender === g.key ? '#c9acac' : '#a80101b2',
                color: gender === g.key ? '#ffffff' : '#ffffff',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 12,
          overflowX: 'auto', scrollbarWidth: 'none'
        }}>
          {[
            { key: 'clothes', label: '👕 Clothes' },
            { key: 'shoes', label: '👟 Shoes' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              style={{
                flexShrink: 0, padding: '7px 16px',
                borderRadius: 20, fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                border: type === t.key ? 'none' : '1px solid #000000',
                background: type === t.key ? '#ffffffc7' : '#a70000',
                color: type === t.key ? '#ffffff' : '#ffffff',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#ffffff', marginBottom: 10 }}>
          {products.length} products found
          {search ? ` for "${search}"` : ''}
        </p>

        {/* Products */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', gap: 10
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: 200, borderRadius: 12, background: '#f1f5f9'
              }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 48 }}>🔍</p>
            <p style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>
              {search ? `No results for "${search}"` : 'No products yet'}
            </p>
            {search && (
              <p style={{ fontSize: 13, marginTop: 6 }}>
                Try different keywords like color or size
              </p>
            )}
          </div>
        ) : (
          <div className="featured-grid">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#000000',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #000000',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{
                  width: '100%',
                  height: 150,
                  minHeight: 150,
                  maxHeight: 150,
                  background: '#000000',
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
                    color: '#ffffff',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{product.name}</p>
                  
                  {product.colors && (
                    <p style={{
                      fontSize: 10,
                      color: '#ffffff',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{product.colors}</p>
                  )}
                  <p style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                  }}>₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}