import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getProductDetail } from '../api/products';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get('ref') === 'direct';
  const shopId = searchParams.get('shop');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    getProductDetail(id)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOrder = () => {
    if (!user) {
      toast.error('Please login to place an order');
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        product, selectedSize, selectedColor
      }));
      navigate('/login', {
        state: { from: `/order/${id}` }
      });
      return;
    }
    navigate(`/order/${id}`, {
      state: { product, selectedSize, selectedColor }
    });
  };

  const handleBack = () => {
    if (isDirect && shopId) {
      navigate(`/shop/${shopId}?ref=direct`);
    } else {
      navigate(-1);
    }
  };

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

  const sizes = product?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const colors = product?.colors?.split(',').map(c => c.trim()).filter(Boolean) || [];
  const images = product?.images?.filter(img => img.image) || [];

  return (
    <div style={{ paddingBottom: 100 }}>

      {/* Back button */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          onClick={handleBack}
          style={{
            background: '#eef2ff', border: 'none',
            color: '#4f46e5', padding: '8px 16px',
            borderRadius: 20, fontSize: 13,
            fontWeight: 500, cursor: 'pointer'
          }}
        >
          ← {isDirect ? `Back to ${product?.shop_name}` : 'Back'}
        </button>
      </div>

      {/* Main image */}
      <div style={{
        height: 300, background: '#f8fafc', margin: '12px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {images[selectedImage]?.image ? (
          <img
            src={images[selectedImage].image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', padding: 8
            }}
          />
        ) : (
          <span style={{ fontSize: 80 }}>
            {product?.category?.product_type === 'shoes' ? '👟' : '👕'}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{
          display: 'flex', gap: 8,
          padding: '0 16px 12px',
          overflowX: 'auto', scrollbarWidth: 'none'
        }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              style={{
                flexShrink: 0, width: 64, height: 64,
                borderRadius: 10, overflow: 'hidden',
                border: selectedImage === i
                  ? '2px solid #4f46e5'
                  : '2px solid #e5e7eb',
                padding: 0, cursor: 'pointer', background: '#f8fafc'
              }}
            >
              <img
                src={img.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '0 16px' }}>

        {/* Shop and name */}
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>
          {product?.shop_name}
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 10
        }}>
          <p style={{
            fontSize: 20, fontWeight: 700, color: '#111827',
            margin: 0, flex: 1, marginRight: 10
          }}>
            {product?.name}
          </p>
          <p style={{
            fontSize: 22, fontWeight: 700,
            color: '#4f46e5', margin: 0, flexShrink: 0
          }}>
            ₹{product?.price}
          </p>
        </div>

        {/* Category badge */}
        <span style={{
          display: 'inline-block', padding: '4px 12px',
          background: '#eef2ff', color: '#4f46e5',
          borderRadius: 20, fontSize: 12, fontWeight: 500,
          textTransform: 'capitalize', marginBottom: 14
        }}>
          {product?.category?.gender} · {product?.category?.product_type}
        </span>

        {/* Description */}
        {product?.description && (
          <p style={{
            fontSize: 14, color: '#6b7280',
            lineHeight: 1.6, marginBottom: 16
          }}>
            {product.description}
          </p>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 13, fontWeight: 600,
              color: '#374151', marginBottom: 8
            }}>
              Color
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '8px 16px', borderRadius: 10,
                    fontSize: 13, cursor: 'pointer',
                    border: selectedColor === color
                      ? '2px solid #4f46e5'
                      : '2px solid #e5e7eb',
                    background: selectedColor === color ? '#eef2ff' : '#fff',
                    color: selectedColor === color ? '#4f46e5' : '#6b7280',
                    fontWeight: 500
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 13, fontWeight: 600,
              color: '#374151', marginBottom: 8
            }}>
              Size
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '8px 16px', borderRadius: 10,
                    fontSize: 13, cursor: 'pointer',
                    border: selectedSize === size
                      ? '2px solid #4f46e5'
                      : '2px solid #e5e7eb',
                    background: selectedSize === size ? '#eef2ff' : '#fff',
                    color: selectedSize === size ? '#4f46e5' : '#6b7280',
                    fontWeight: 500
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <p style={{
          fontSize: 13, color: '#10b981',
          fontWeight: 500, marginBottom: 80
        }}>
          {product?.stock > 0
            ? `✓ ${product.stock} in stock`
            : '✗ Out of stock'
          }
        </p>

      </div>

      {/* Fixed bottom order button */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 20px',
        background: '#fff',
        borderTop: '1px solid #f1f5f9',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          maxWidth: 600, margin: '0 auto'
        }}>
          <div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Total</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
              ₹{product?.price}
            </p>
          </div>
          <button
            onClick={handleOrder}
            disabled={product?.stock === 0}
            style={{
              flex: 1, padding: '14px',
              background: product?.stock === 0 ? '#d1d5db' : '#4f46e5',
              color: '#fff', border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {product?.stock === 0 ? 'Out of Stock' : 'Order Now (COD)'}
          </button>
        </div>
      </div>

    </div>
  );
}