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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Products</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, color, size..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
          autoFocus
        />
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-2">
            {['', 'men', 'women', 'kids'].map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  gender === g
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {g === '' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['', 'clothes', 'shoes'].map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  type === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === '' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{products.length} products found</p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-2">Try different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="h-44 bg-primary-50 flex items-center justify-center overflow-hidden">
                {product.images?.[0]?.image ? (
                  <img
                    src={product.images[0].image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-5xl">
                    {product.category?.product_type === 'shoes' ? '👟' : '👕'}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{product.shop_name}</p>
                {product.colors && (
                  <p className="text-primary-500 text-xs mt-0.5">{product.colors}</p>
                )}
                <p className="text-primary-600 font-bold mt-1">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}