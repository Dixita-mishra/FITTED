import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Star, 
  Shirt, 
  RefreshCw,
  Heart
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const data = await api.recommendations.getProductById(id);
      if (data) {
        setProduct(data);
        setSelectedImage(data.image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-fitted-gold animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading personalized product intelligence...</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1"
      >
        &larr; Back to Recommendations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-[480px]">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-fitted-gold/40 text-fitted-gold text-xs font-bold flex items-center gap-1.5 shadow-2xl">
              <Sparkles className="w-4 h-4" />
              <span>{product.matchScore}% Match Confidence</span>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-fitted-gold scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Intelligence Details */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-fitted-gold uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-display font-bold text-white">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Save ${product.originalPrice - product.price}
              </span>
            </div>
          </div>

          {/* AI Synergy Box */}
          <div className="glass-panel-gold p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-fitted-gold font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Fashion Intelligence Compatibility Note</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              {product.matchReason}
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
              <Shirt className="w-4 h-4 shrink-0" />
              <span>Direct pairing in your closet: {product.pairedItemName}</span>
            </div>
          </div>

          {/* Fabric & Fit Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
              <span className="text-gray-400">Fabric Composition</span>
              <p className="text-white font-semibold">{product.fabric}</p>
            </div>
            <div className="p-3 rounded-xl bg-fitted-card/70 border border-white/5 space-y-1">
              <span className="text-gray-400">Silhoutte Fit</span>
              <p className="text-white font-semibold">{product.fitType}</p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Select Size</span>
              <button className="text-fitted-gold hover:underline text-[10px]">AI Fit Size Predictor (M)</button>
            </div>
            <div className="flex items-center gap-3">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-fitted-gold text-black border border-fitted-gold shadow-glow-gold/10'
                      : 'bg-fitted-card text-gray-300 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleAdd}
              className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-fitted-card text-white border border-white/20 hover:border-fitted-gold'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{added ? 'Added to Bag' : 'Add to Fitted Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-glow-gold/20"
            >
              <span>Buy with Razorpay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-fitted-gold" />
            <span>30-Day Guaranteed Fit Exchange & Free Express Shipping</span>
          </div>

        </div>

      </div>

    </div>
  );
}
