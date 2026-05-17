import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PlaceOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, selectedSize, selectedColor } = state || {};
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    delivery_address: '',
    delivery_phone: user?.phone || '',
    delivery_pincode: '',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          product_id: product.id,
          quantity: 1,
          price: parseFloat(product.price),
          size: selectedSize || '',
          color: selectedColor || '',
        }]
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Place Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-900 text-right max-w-32">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shop</span>
              <span className="font-medium text-gray-900">{product.shop_name}</span>
            </div>
            {selectedSize && (
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span className="font-medium text-gray-900">{selectedSize}</span>
              </div>
            )}
            {selectedColor && (
              <div className="flex justify-between">
                <span className="text-gray-500">Color</span>
                <span className="font-medium text-gray-900">{selectedColor}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary-600 text-lg">₹{product.price}</span>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-yellow-700 text-xs font-medium">💵 Cash on Delivery</p>
          </div>
        </div>

        {/* Delivery form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={form.delivery_address}
                onChange={e => setForm({ ...form, delivery_address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Full delivery address"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                value={form.delivery_phone}
                onChange={e => setForm({ ...form, delivery_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                maxLength={6}
                value={form.delivery_pincode}
                onChange={e => setForm({ ...form, delivery_pincode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="6-digit pincode"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Special instructions"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Placing order...' : `Confirm Order — ₹${product.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}