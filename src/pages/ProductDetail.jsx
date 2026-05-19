import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
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
      navigate(`/login${isDirect ? '?ref=direct&shop=' + shopId : ''}`);
      return;
    }
    // Before navigating to place order, validate size
    if (!selectedSize) {
      toast.error('Please select a size before ordering');
      return;
    }
    // Before navigating to place order, validate size
    if (!selectedColor) {
      toast.error('Please select a color before ordering');
      return;
    }
    navigate(`/order/${product.id}${isDirect ? '?ref=direct&shop=' + shopId : ''}`, {
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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const sizes = product?.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const colors = product?.colors?.split(',').map(c => c.trim()).filter(Boolean) || [];
  const images = product?.images?.filter(img => img.image) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="text-primary-600 text-sm mb-6 hover:underline flex items-center gap-1"
      >
        ← {isDirect ? `Back to ${product?.shop_name}` : 'Back'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Images */}
        <div>
          <div className="bg-primary-50 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
            {images[selectedImage]?.image ? (
              <img
                src={images[selectedImage].image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">
                {product?.category?.product_type === 'shoes' ? '👟' : '👕'}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-400 mb-1">{product?.shop_name}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product?.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mb-4">₹{product?.price}</p>

          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full capitalize mb-4">
            {product?.category?.gender} · {product?.category?.product_type}
          </span>

          {product?.description && (
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-green-600 mb-6">
            {product?.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <button
            onClick={handleOrder}
            disabled={product?.stock === 0}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {product?.stock === 0 ? 'Out of Stock' : 'Order Now (COD)'}
          </button>
        </div>
      </div>

      {/* Direct link footer */}
      {isDirect && (
        <div className="mt-12 text-center border-t border-gray-100 pt-8">
          <p className="text-gray-400 text-sm">Powered by</p>
          <Link to="/" className="text-primary-600 font-bold text-lg">kartifys</Link>
        </div>
      )}
    </div>
  );
}