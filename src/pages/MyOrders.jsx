import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium text-gray-600">No orders yet</p>
          <p className="text-sm mt-2">Your orders will appear here</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    · {item.product?.name}
                    {item.size ? ` (${item.size})` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                    {' '}× {item.quantity}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">📍 {order.delivery_address}</p>
                  {order.delivery_pincode && (
                    <p className="text-xs text-gray-400">📮 {order.delivery_pincode}</p>
                  )}
                </div>
                <p className="font-bold text-primary-600 text-lg">₹{order.total_price}</p>
              </div>

              {order.status === 'cancelled' && order.cancel_reason && (
                <div className="mt-3 bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-700">
                    <span className="font-semibold">Cancelled: </span>
                    {order.cancel_reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}