import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getShops } from '../api/shops';

const COLORS = [
  '#4f46e5', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#7c3aed',
];

const GENDER_INFO = {
  men: { label: 'Men', emoji: '👔', color: '#0891b2' },
  women: { label: 'Women', emoji: '👗', color: '#dc2626' },
  kids: { label: 'Kids', emoji: '🧒', color: '#059669' },
};

export default function Category() {
  const { gender } = useParams();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');

  const info = GENDER_INFO[gender] || GENDER_INFO.men;

  useEffect(() => {
    getShops()
      .then(res => setShops(res.data))
      .finally(() => setLoading(false));
  }, [gender]);

  const filteredShops = shops.filter(s => {
    if (activeType) {
      return s.category === `${gender}_${activeType}`;
    }
    return (
      s.category === `${gender}_clothes` ||
      s.category === `${gender}_shoes`
    );
  });

  return (
    <div>

      {/* Header */}
      <div style={{
        background: info.color,
        padding: '48px 16px 20px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none', color: '#fff',
            padding: '6px 14px', borderRadius: 20,
            fontSize: 13, cursor: 'pointer', marginBottom: 12
          }}
        >
          ← Back
        </button>
        <p style={{
          color: '#fff', fontSize: 26,
          fontWeight: 700, margin: 0
        }}>
          {info.emoji} {info.label}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '4px 0 0' }}>
          {filteredShops.length} shops available
        </p>
      </div>

      {/* Sub category filter — Clothes and Shoes */}
      <div style={{
        display: 'flex', gap: 10,
        padding: '14px 14px 6px'
      }}>
        {[
          { key: '', label: `All ${info.label}` },
          { key: 'clothes', label: `${info.emoji} Clothes` },
          { key: 'shoes', label: `👟 Shoes` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveType(t.key)}
            style={{
              flex: 1, padding: '11px 0',
              borderRadius: 12,
              border: activeType === t.key ? 'none' : '1px solid #e5e7eb',
              background: activeType === t.key ? info.color : '#fff',
              color: activeType === t.key ? '#fff' : '#6b7280',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Also browse products */}
      <div style={{ padding: '8px 14px' }}>
        <Link
          to={`/products?gender=${gender}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#eef2ff', borderRadius: 12,
            padding: '12px 16px', textDecoration: 'none',
          }}
        >
          <span>🔍</span>
          <span style={{ color: '#4f46e5', fontSize: 14, fontWeight: 500, flex: 1 }}>
            Search {info.label.toLowerCase()} products
          </span>
          <span style={{ color: '#4f46e5', fontSize: 20 }}>›</span>
        </Link>
      </div>

      {/* Shops grid */}
      <div style={{ padding: '4px 14px 24px' }}>
        <p style={{
          fontSize: 15, fontWeight: 700,
          color: '#111827', marginBottom: 12
        }}>
          {info.label} Shops
        </p>

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
            gap: 8
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
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>
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
      </div>
    </div>
  );
}