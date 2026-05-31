import { useState, useEffect } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import { placeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const POLICY_EN = [
  'Returns accepted ONLY for exchange or damaged products.',
  'Record a video BEFORE breaking the delivery box seal.',
  'Without unboxing video, returns will NOT be accepted.',
  'Video must clearly show intact seal, then product inside.',
  'Return request must be raised within 24 hours of delivery.',
  'Same product will be exchanged — no cash refunds.',
  'Used or customer-damaged products will not be accepted.',
];

const POLICY_ML = [
  'ഉൽപ്പന്നം മാറ്റം ചെയ്യുന്നതിനോ കേടായ ഉൽപ്പന്നങ്ങൾക്കോ മാത്രം റിട്ടേൺ.',
  'ഡെലിവറി ബോക്സ് സീൽ പൊട്ടിക്കുന്നതിന് മുമ്പ് വീഡിയോ എടുക്കണം.',
  'അൺബോക്സിംഗ് വീഡിയോ ഇല്ലാതെ ഒരു കാരണവശാലും റിട്ടേൺ സ്വീകരിക്കില്ല.',
  'വീഡിയോയിൽ സീൽ അതേ പടി ഉള്ളതും ഉൽപ്പന്നം വ്യക്തമായും കാണണം.',
  'ഡെലിവറി ലഭിച്ച് 24 മണിക്കൂറിനകം അഭ്യർത്ഥന നൽകണം.',
  'അതേ ഉൽപ്പന്നം മാറ്റിനൽകും — പണം തിരിച്ചുനൽകില്ല.',
  'ഉപയോഗിച്ചതോ കേടാക്കിയതോ ആയ ഉൽപ്പന്നങ്ങൾ സ്വീകരിക്കില്ല.',
];

export default function PlaceOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [lang, setLang] = useState('english');
  const [form, setForm] = useState({
    delivery_address: '',
    delivery_phone: user?.phone || '',
    delivery_pincode: '',
    note: '',
  });

  useEffect(() => {
    // Get order data from state or sessionStorage
    if (state?.product) {
      setOrderData(state);
      sessionStorage.removeItem('pendingOrder');
    } else {
      const saved = sessionStorage.getItem('pendingOrder');
      if (saved) {
        setOrderData(JSON.parse(saved));
        sessionStorage.removeItem('pendingOrder');
      } else {
        navigate('/');
      }
    }
  }, [state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!policyAccepted) {
      toast.error('Please read and accept the Return Policy');
      setShowPolicy(true);
      return;
    }
    if (form.delivery_pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    setLoading(true);
    try {
      await placeOrder({
        delivery_address: form.delivery_address,
        delivery_phone: form.delivery_phone,
        delivery_pincode: form.delivery_pincode,
        note: form.note,
        items: [{
          product_id: orderData.product.id,
          quantity: 1,
          price: parseFloat(orderData.product.price),
          size: orderData.selectedSize || '',
          color: orderData.selectedColor || '',
        }]
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return null;

  const { product, selectedSize, selectedColor } = orderData;
  const policy = lang === 'english' ? POLICY_EN : POLICY_ML;

  return (
    <div style={{ paddingBottom: 40 }}>

      {/* Return Policy Modal */}
      {showPolicy && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: 600,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            maxHeight: '90vh', display: 'flex', flexDirection: 'column'
          }}>

            {/* Modal header */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 10
              }}>
                <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>
                  {lang === 'english' ? 'Return & Exchange Policy' : 'റിട്ടേൺ & എക്സ്ചേഞ്ച് നയം'}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['english', 'malayalam'].map(l => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      style={{
                        padding: '4px 10px', borderRadius: 20,
                        fontSize: 11, fontWeight: 500, cursor: 'pointer',
                        border: 'none',
                        background: lang === l ? '#4f46e5' : '#f1f5f9',
                        color: lang === l ? '#fff' : '#6b7280',
                      }}
                    >
                      {l === 'english' ? 'English' : 'മലയാളം'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div style={{
                background: '#fef2f2', borderRadius: 10,
                padding: '10px 12px', border: '1px solid #fecaca'
              }}>
                <p style={{ color: '#b91c1c', fontSize: 13, fontWeight: 600, margin: 0 }}>
                  ⚠️ {lang === 'english'
                    ? 'MANDATORY: Record unboxing video before opening!'
                    : 'നിർബന്ധം: തുറക്കുന്നതിന് മുമ്പ് വീഡിയോ എടുക്കുക!'
                  }
                </p>
              </div>
            </div>

            {/* Policy points */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {policy.map((point, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, marginBottom: 12
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#eef2ff', color: '#4f46e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1
                  }}>
                    {i + 1}
                  </div>
                  <p style={{
                    fontSize: 13, color: '#374151',
                    lineHeight: 1.6, margin: 0
                  }}>
                    {point}
                  </p>
                </div>
              ))}

              {/* Video instructions */}
              <div style={{
                background: '#fffbeb', borderRadius: 12,
                padding: 14, border: '1px solid #fde68a', marginTop: 8
              }}>
                <p style={{
                  fontSize: 13, fontWeight: 600,
                  color: '#92400e', marginBottom: 8
                }}>
                  🎥 {lang === 'english'
                    ? 'How to record unboxing video:'
                    : 'അൺബോക്സിംഗ് വീഡിയോ എങ്ങനെ:'
                  }
                </p>
                {(lang === 'english' ? [
                  'Start recording BEFORE touching the box',
                  'Show full box with seal intact on camera',
                  'Slowly break seal and open the box',
                  'Show product inside clearly',
                  'Save the video for return claims',
                ] : [
                  'ബോക്സ് തൊടുന്നതിന് മുമ്പ് റെക്കോർഡ് ആരംഭിക്കുക',
                  'സീൽ ഉള്ള ബോക്സ് കാമറയിൽ കാണിക്കുക',
                  'സാവധാനം സീൽ പൊട്ടിച്ച് ബോക്സ് തുറക്കുക',
                  'ഉൽപ്പന്നം വ്യക്തമായി കാണിക്കുക',
                  'റിട്ടേണിനായി വീഡിയോ സൂക്ഷിക്കുക',
                ]).map((step, i) => (
                  <p key={i} style={{
                    fontSize: 12, color: '#92400e',
                    margin: '0 0 4px'
                  }}>
                    {i + 1}. {step}
                  </p>
                ))}
              </div>
            </div>

            {/* Accept section */}
            <div style={{
              padding: 16, borderTop: '1px solid #f1f5f9',
              background: '#f8fafc',
              borderBottomLeftRadius: 24, borderBottomRightRadius: 24
            }}>
              <label style={{
                display: 'flex', alignItems: 'flex-start',
                gap: 10, cursor: 'pointer', marginBottom: 14
              }}>
                <div
                  onClick={() => setPolicyAccepted(!policyAccepted)}
                  style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: policyAccepted ? 'none' : '2px solid #d1d5db',
                    background: policyAccepted ? '#4f46e5' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, cursor: 'pointer', marginTop: 1
                  }}
                >
                  {policyAccepted && (
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'english'
                    ? 'I have read and agree to the return policy. I will record an unboxing video before opening.'
                    : 'ഞാൻ നയം വായിക്കുകയും സമ്മതിക്കുകയും ചെയ്തു. തുറക്കുന്നതിന് മുമ്പ് വീഡിയോ എടുക്കും.'
                  }
                </p>
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowPolicy(false)}
                  style={{
                    flex: 1, padding: '12px',
                    border: '1px solid #d1d5db',
                    background: '#fff', color: '#6b7280',
                    borderRadius: 12, fontSize: 14,
                    fontWeight: 500, cursor: 'pointer'
                  }}
                >
                  {lang === 'english' ? 'Cancel' : 'റദ്ദാക്കുക'}
                </button>
                <button
                  onClick={() => {
                    if (!policyAccepted) {
                      toast.error(lang === 'english'
                        ? 'Please tick the checkbox'
                        : 'ടിക്ക് ചെയ്യുക'
                      );
                      return;
                    }
                    setShowPolicy(false);
                  }}
                  style={{
                    flex: 1, padding: '12px',
                    background: policyAccepted ? '#4f46e5' : '#a5b4fc',
                    color: '#fff', border: 'none',
                    borderRadius: 12, fontSize: 14,
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {lang === 'english' ? 'I Accept' : 'ഞാൻ സമ്മതിക്കുന്നു'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        padding: '48px 16px 20px'
      }}>
        <p style={{ color: '#c7d2fe', fontSize: 13, margin: '0 0 4px' }}>
          TrendKart
        </p>
        <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
          Place Order
        </p>
      </div>

      <div style={{ padding: 16 }}>

        {/* Order summary */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          padding: 16, marginBottom: 16
        }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 12 }}>
            Order Summary
          </p>

          {/* Product image and info */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 70, height: 70, background: '#f8fafc',
              borderRadius: 10, overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {product.images?.[0]?.image ? (
                <img
                  src={product.images[0].image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: 32 }}>
                  {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>
                {product.name}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0' }}>
                {product.shop_name}
              </p>
              {selectedSize && (
                <span style={{
                  display: 'inline-block', fontSize: 11,
                  background: '#eef2ff', color: '#4f46e5',
                  padding: '2px 8px', borderRadius: 6, marginRight: 4
                }}>
                  Size: {selectedSize}
                </span>
              )}
              {selectedColor && (
                <span style={{
                  display: 'inline-block', fontSize: 11,
                  background: '#eef2ff', color: '#4f46e5',
                  padding: '2px 8px', borderRadius: 6
                }}>
                  Color: {selectedColor}
                </span>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 10
          }}>
            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Total</p>
            <p style={{ fontWeight: 700, color: '#4f46e5', fontSize: 18, margin: 0 }}>
              ₹{product.price}
            </p>
          </div>

          <div style={{
            background: '#fefce8', borderRadius: 10,
            padding: '8px 12px', textAlign: 'center', marginBottom: 10
          }}>
            <p style={{ fontSize: 13, color: '#854d0e', margin: 0, fontWeight: 500 }}>
              💵 Cash on Delivery (COD)
            </p>
          </div>

          {/* Return policy button */}
          <button
            onClick={() => setShowPolicy(true)}
            style={{
              width: '100%', padding: '10px',
              border: '1px solid #c7d2fe', background: '#eef2ff',
              color: '#4f46e5', borderRadius: 10,
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}
          >
            📋 View Return & Exchange Policy
          </button>

          {policyAccepted && (
            <div style={{
              marginTop: 10, background: '#f0fdf4',
              border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '8px 12px', display: 'flex',
              alignItems: 'center', gap: 8
            }}>
              <span style={{ color: '#16a34a' }}>✅</span>
              <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontWeight: 500 }}>
                Return policy accepted
              </p>
            </div>
          )}
        </div>

        {/* Delivery form */}
        <form onSubmit={handleSubmit} style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          padding: 16
        }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 16 }}>
            Delivery Details
          </p>

          {[
            { label: 'Delivery Address *', key: 'delivery_address', type: 'textarea', placeholder: 'Full delivery address' },
            { label: 'Phone Number *', key: 'delivery_phone', type: 'tel', placeholder: 'Your phone number' },
            { label: 'Pincode *', key: 'delivery_pincode', type: 'tel', placeholder: '6-digit pincode', maxLength: 6 },
            { label: 'Note (optional)', key: 'note', type: 'text', placeholder: 'Special instructions' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#374151', marginBottom: 6
              }}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e5e7eb', borderRadius: 10,
                    fontSize: 14, outline: 'none',
                    boxSizing: 'border-box', resize: 'none'
                  }}
                />
              ) : (
                <input
                  required={field.key !== 'note'}
                  type={field.type}
                  maxLength={field.maxLength}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e5e7eb', borderRadius: 10,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              )}
            </div>
          ))}

          {!policyAccepted && (
            <div
              onClick={() => setShowPolicy(true)}
              style={{
                background: '#fffbeb', borderRadius: 10,
                padding: '12px', marginBottom: 14,
                border: '1px solid #fde68a', cursor: 'pointer'
              }}
            >
              <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 500 }}>
                ⚠️ Read and accept the Return Policy to continue
              </p>
              <p style={{
                fontSize: 12, color: '#b45309',
                margin: '3px 0 0', textDecoration: 'underline'
              }}>
                Tap here to read →
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#a5b4fc' : '#4f46e5',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {loading ? 'Placing order...' : `Confirm Order — ₹${product.price}`}
          </button>
        </form>

      </div>
    </div>
  );
}