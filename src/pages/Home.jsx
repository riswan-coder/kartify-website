import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '../api/shops';
import { getProducts } from '../api/products';
import { getPopupAd, getBannerAds } from '../api/ads';

const COLORS = [
  '#4f46e5', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#7c3aed',
];

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'men_clothes', label: 'Men Clothes' },
  { key: 'men_shoes', label: 'Men Shoes' },
  { key: 'women_clothes', label: 'Women Clothes' },
  { key: 'women_shoes', label: 'Women Shoes' },
  { key: 'kids_clothes', label: 'Kids Clothes' },
  { key: 'kids_shoes', label: 'Kids Shoes' },
];

export default function Home() {
  const [shops, setShops] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [popupAd, setPopupAd] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const bannerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getShops(),
      getProducts({}),
      getBannerAds(),
      getPopupAd(),
    ]).then(([shopsRes, productsRes, bannersRes, popupRes]) => {
      setShops(shopsRes.data);
      setFeaturedProducts(productsRes.data.slice(0, 8));
      if (bannersRes.data?.length > 0) {
        setBannerAds(bannersRes.data);
      }
      if (popupRes.data?.image_url) {
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

  const filteredShops = shops.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === '' || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Popup Ad Modal */}
      {showPopup && popupAd && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm hover:bg-opacity-70 transition-colors"
            >
              ✕
            </button>
            <Link
              to={`/shop/${popupAd.shop?.id}`}
              onClick={() => setShowPopup(false)}
            >
              <img
                src={popupAd.image_url}
                alt="Advertisement"
                className="w-full object-cover max-h-80"
              />
            </Link>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{popupAd.shop?.name}</p>
                <p className="text-gray-400 text-sm">{popupAd.shop?.city}</p>
              </div>
              <Link
                to={`/shop/${popupAd.shop?.id}`}
                onClick={() => setShowPopup(false)}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Visit Shop
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Local, Delivered to You
          </h1>
          <p className="text-primary-100 text-lg mb-8">
            Discover the best local clothing and shoe shops in your area
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="text"
              placeholder="Search shops or cities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Link
              to="/products"
              className="bg-white text-primary-600 px-6 py-3 rounded-xl font-medium text-sm hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              Search Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Banner Ads */}
        {bannerAds.length > 0 && (
          <div className="mb-10">
            <div className="relative rounded-2xl overflow-hidden h-48 md:h-60">
              {bannerAds.map((ad, index) => (
                <Link
                  key={ad.id}
                  to={`/shop/${ad.shop?.id}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    currentBanner === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {ad.image_url ? (
                    <img
                      src={ad.image_url}
                      alt={ad.shop?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                      <p className="text-white text-xl font-bold">{ad.shop?.name}</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white font-bold">{ad.shop?.name}</p>
                    <p className="text-gray-300 text-sm">{ad.shop?.city}</p>
                  </div>
                </Link>
              ))}

              {/* Dots */}
              {bannerAds.length > 1 && (
                <div className="absolute bottom-3 right-4 flex gap-1.5">
                  {bannerAds.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentBanner(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentBanner === i ? 'bg-white' : 'bg-white bg-opacity-40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Shops grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Local Shops</h2>
            <span className="text-gray-500 text-sm">{filteredShops.length} shops</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🏪</p>
              <p>No shops found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredShops.map((shop, index) => (
                <Link
                  key={shop.id}
                  to={`/shop/${shop.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-20 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {shop.logo_url ? (
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {shop.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm truncate">{shop.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{shop.city}</p>
                    <p className="text-primary-600 text-xs mt-1 font-medium">
                      {shop.product_count} items
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-primary-600 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-primary-50 flex items-center justify-center overflow-hidden">
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
                  <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{product.shop_name}</p>
                  <p className="text-primary-600 font-bold mt-1">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}