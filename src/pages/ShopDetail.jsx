import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getShopDetail } from '../api/shops';
import { getProducts } from '../api/products';

export default function ShopDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get('ref') === 'direct';

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Shop header */}
      <div className="bg-primary-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Back or Close button */}
          {isDirect ? (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.close();
                }
              }}
              className="flex items-center gap-2 text-primary-200 text-sm hover:text-white mb-4 bg-white bg-opacity-10 px-4 py-2 rounded-lg transition-colors"
            >
              <span className="text-lg">✕</span>
              <span>Close</span>
            </button>
          ) : (
            <Link
              to="/"
              className="text-primary-200 text-sm hover:text-white mb-4 inline-block"
            >
              ← Back to shops
            </Link>
          )}

          {/* Shop info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center overflow-hidden">
              {shop?.logo_url ? (
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {shop?.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{shop?.name}</h1>
              <p className="text-primary-200 text-sm mt-1">
                {shop?.city} · {shop?.phone}
              </p>
              {shop?.category && (
                <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                  {shop.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </div>
          </div>

          {/* Direct link badge */}
          {isDirect && (
            <div className="mt-4 bg-white bg-opacity-10 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-xl">🏪</span>
              <div>
                <p className="text-sm font-medium">Welcome to {shop?.name}</p>
                <p className="text-xs text-primary-200 mt-0.5">
                  Browse products and place orders below
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products in this shop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} products</p>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">👕</p>
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}${isDirect ? '?ref=direct&shop=' + id : ''}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-44 bg-primary-50 flex items-center justify-center overflow-hidden">
                  {product.images?.[0]?.image ? (
                    <img
                      src={product.images[0].image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">
                      {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {product.name}
                  </p>
                  {product.colors && (
                    <p className="text-xs text-gray-400 mt-0.5">{product.colors}</p>
                  )}
                  <p className="text-primary-600 font-bold mt-1">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Direct link footer */}
        {isDirect && (
          <div className="mt-12 text-center border-t border-gray-100 pt-8">
            <p className="text-gray-400 text-sm">Powered by</p>
            <Link to="/" className="text-primary-600 font-bold text-lg">kartifys</Link>
            <p className="text-gray-400 text-xs mt-1">
              Shop local · delivered to you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}