import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121218] border-l border-fitted-border/60 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-fitted-gold/10 text-fitted-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Fitted Bag</h3>
                <p className="text-xs text-gray-400">{cart.length} item(s) selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400">Your bag is currently empty.</p>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/recommendations'); }}
                  className="px-4 py-2 text-xs font-bold bg-fitted-gold text-black rounded-full"
                >
                  Explore Recommendations
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-3 rounded-2xl glass-card relative">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-gray-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">{item.product.brand} • Size {item.size}</p>
                      
                      {/* Match Badge */}
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-fitted-gold/15 text-fitted-gold text-[9px] font-bold">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.product.matchScore}% Style Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-fitted-card px-2 py-1 rounded-lg border border-white/5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="text-xs text-gray-400 hover:text-white px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="text-xs text-gray-400 hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-white">${item.product.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 space-y-4 bg-fitted-card/50">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Personalized Styling Discount</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-fitted-gold">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-glow-gold/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-fitted-gold" />
                <span>Protected by Razorpay Test Sandbox Security</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
