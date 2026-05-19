import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RETURN_POLICY = {
  english: {
    title: "Return & Exchange Policy",
    points: [
      "Returns are accepted ONLY if the product is damaged/defective or if you received a wrong product.",
      "Before opening the delivery box, you MUST record a video of yourself breaking the seal and opening the box.",
      "Without an unboxing video, return requests will NOT be accepted under any circumstances.",
      "The video must clearly show the box is unopened, the seal is intact, and the product inside is damaged or incorrect.",
      "Return request must be raised within 24 hours of delivery.",
      "The same product will be exchanged — no cash refunds.",
      "Products that are used, washed, or damaged by the customer will not be accepted.",
      "TrendKart reserves the right to reject returns if the conditions above are not met.",
    ]
  },
  malayalam: {
    title: "റിട്ടേൺ & എക്സ്ചേഞ്ച് നയം",
    points: [
      "ഉൽപ്പന്നം കേടായിട്ടുണ്ടെങ്കിൽ അല്ലെങ്കിൽ തെറ്റായ ഉൽപ്പന്നം ലഭിച്ചിട്ടുണ്ടെങ്കിൽ മാത്രമേ റിട്ടേൺ സ്വീകരിക്കൂ.",
      "ഡെലിവറി ബോക്സ് തുറക്കുന്നതിന് മുമ്പ്, സീൽ പൊട്ടിക്കുന്നതും ബോക്സ് തുറക്കുന്നതും നിർബന്ധമായും വീഡിയോ എടുക്കണം.",
      "അൺബോക്സിംഗ് വീഡിയോ ഇല്ലാതെ ഒരു കാരണവശാലും റിട്ടേൺ അഭ്യർത്ഥന സ്വീകരിക്കില്ല.",
      "വീഡിയോയിൽ ബോക്സ് തുറക്കാത്തതും സീൽ അതേ പടി ഉള്ളതും ഉൽപ്പന്നം കേടായതോ തെറ്റായതോ ആണെന്ന് വ്യക്തമായി കാണിക്കണം.",
      "ഡെലിവറി ലഭിച്ച് 24 മണിക്കൂറിനകം റിട്ടേൺ അഭ്യർത്ഥന നൽകണം.",
      "അതേ ഉൽപ്പന്നം മാറ്റിനൽകും — പണം തിരിച്ചുനൽകില്ല.",
      "ഉപയോഗിച്ചതോ കഴുകിയതോ ഉപഭോക്താവ് കേടാക്കിയതോ ആയ ഉൽപ്പന്നങ്ങൾ സ്വീകരിക്കില്ല.",
      "മേൽ‌പ്പറഞ്ഞ നിബന്ധനകൾ പാലിക്കാത്ത പക്ഷം ട്രെൻഡ്കാർട്ടിന് റിട്ടേൺ നിരസിക്കാൻ അവകാശമുണ്ട്.",
    ]
  }
};

export default function PlaceOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, selectedSize, selectedColor } = state || {};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!policyAccepted) {
      toast.error('Please read and accept the Return Policy before ordering');
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
          product_id: product.id,
          quantity: 1,
          price: parseFloat(product.price),
          size: selectedSize || '',
          color: selectedColor || '',
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

  if (!product) {
    navigate('/');
    return null;
  }

  const policy = RETURN_POLICY[lang];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Return Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">

            {/* Modal header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  {policy.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLang('english')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      lang === 'english'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLang('malayalam')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      lang === 'malayalam'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    മലയാളം
                  </button>
                </div>
              </div>

              {/* Important notice */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                <div>
                  <p className="text-red-700 font-semibold text-sm">
                    {lang === 'english'
                      ? 'MANDATORY: Record an unboxing video!'
                      : 'നിർബന്ധം: അൺബോക്സിംഗ് വീഡിയോ എടുക്കുക!'
                    }
                  </p>
                  <p className="text-red-600 text-xs mt-0.5">
                    {lang === 'english'
                      ? 'Without video proof, returns will NOT be accepted'
                      : 'വീഡിയോ ഇല്ലാതെ റിട്ടേൺ സ്വീകരിക്കില്ല'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Policy points */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {policy.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              {/* Video instruction box */}
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎥</span>
                  <p className="font-semibold text-amber-800 text-sm">
                    {lang === 'english'
                      ? 'How to record your unboxing video:'
                      : 'അൺബോക്സിംഗ് വീഡിയോ എങ്ങനെ എടുക്കാം:'
                    }
                  </p>
                </div>
                <ol className="space-y-1.5">
                  {(lang === 'english' ? [
                    'Start recording BEFORE touching the box',
                    'Show the full box with seal intact on camera',
                    'Slowly break the seal and open the box on camera',
                    'Show the product inside clearly',
                    'Keep recording until product is fully visible',
                    'Save the video — you may need it for returns',
                  ] : [
                    'ബോക്സ് തൊടുന്നതിന് മുമ്പ് റെക്കോർഡിംഗ് ആരംഭിക്കുക',
                    'സീൽ അതേ പടി ഉള്ള മുഴുവൻ ബോക്സും കാമറയിൽ കാണിക്കുക',
                    'സാവധാനം സീൽ പൊട്ടിച്ച് ബോക്സ് തുറക്കുക',
                    'ഉള്ളിലെ ഉൽപ്പന്നം വ്യക്തമായി കാണിക്കുക',
                    'ഉൽപ്പന്നം പൂർണ്ണമായി കാണുന്നതുവരെ റെക്കോർഡ് ചെയ്യുക',
                    'വീഡിയോ സൂക്ഷിക്കുക — റിട്ടേണിന് ആവശ്യമായേക്കാം',
                  ]).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold text-xs mt-0.5">
                        {i + 1}.
                      </span>
                      <p className="text-amber-800 text-xs">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Accept section */}
            <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={e => setPolicyAccepted(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {lang === 'english'
                    ? 'I have read and understood the return policy. I agree to record an unboxing video before opening the delivery box.'
                    : 'ഞാൻ റിട്ടേൺ നയം വായിക്കുകയും മനസ്സിലാക്കുകയും ചെയ്തു. ഡെലിവറി ബോക്സ് തുറക്കുന്നതിന് മുമ്പ് അൺബോക്സിംഗ് വീഡിയോ എടുക്കാൻ ഞാൻ സമ്മതിക്കുന്നു.'
                  }
                </span>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPolicy(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  {lang === 'english' ? 'Cancel' : 'റദ്ദാക്കുക'}
                </button>
                <button
                  onClick={() => {
                    if (!policyAccepted) {
                      toast.error(
                        lang === 'english'
                          ? 'Please tick the checkbox to accept'
                          : 'സ്വീകരിക്കാൻ ടിക്ക് ചെയ്യുക'
                      );
                      return;
                    }
                    setShowPolicy(false);
                  }}
                  disabled={!policyAccepted}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lang === 'english' ? 'I Accept' : 'ഞാൻ സമ്മതിക്കുന്നു'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Place Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-900 text-right max-w-40">
                {product.name}
              </span>
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

          {/* Return policy button */}
          <button
            onClick={() => setShowPolicy(true)}
            className="w-full mt-3 border border-primary-200 text-primary-600 py-2 rounded-lg text-xs font-medium hover:bg-primary-50 transition-colors"
          >
            📋 View Return & Exchange Policy
          </button>

          {/* Policy accepted badge */}
          {policyAccepted && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <p className="text-green-700 text-xs font-medium">
                Return policy accepted
              </p>
            </div>
          )}
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

            {/* Must accept policy warning */}
            {!policyAccepted && (
              <div
                className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-pointer"
                onClick={() => setShowPolicy(true)}
              >
                <p className="text-amber-700 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  You must read and accept the Return Policy before ordering
                </p>
                <p className="text-amber-600 text-xs mt-1 underline">
                  Click here to read and accept →
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-60"
            >
              {loading
                ? 'Placing order...'
                : `Confirm Order — ₹${product.price}`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}