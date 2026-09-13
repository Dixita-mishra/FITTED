import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShoppingBag,
  Building,
  Check
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: 'Dixita Mishra',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [testOtp, setTestOtp] = useState('123456');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Your bag is empty</h2>
        <button
          onClick={() => navigate('/recommendations')}
          className="px-6 py-3 rounded-full bg-fitted-gold text-black font-bold text-xs"
        >
          Browse Recommendations
        </button>
      </div>
    );
  }

  const handleInitiateRazorpay = async () => {
    setIsProcessing(true);
    // Create payment order via backend API
    const order = await api.payments.createOrder(cart, subtotal);
    setIsProcessing(false);
    setRazorpayModalOpen(true);
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsProcessing(true);
    // Verify signature with backend
    const verifyRes = await api.payments.verifyPayment({
      razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 10)}`,
      razorpay_order_id: `ord_${Math.random().toString(36).substring(2, 10)}`,
      razorpay_signature: 'mock_signature_valid'
    });

    setIsProcessing(false);
    setRazorpayModalOpen(false);
    clearCart();
    navigate('/order-success', { state: { transaction: verifyRes } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Razorpay Integration Interface</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white">Express Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Shipping Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-gold rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-fitted-gold" />
              <span>1. Shipping & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="text-gray-300 font-semibold">Full Recipient Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white focus:outline-none focus:border-fitted-gold"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-gray-300 font-semibold">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white focus:outline-none focus:border-fitted-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white focus:outline-none focus:border-fitted-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">ZIP / Postal Code</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-fitted-card border border-white/10 text-white focus:outline-none focus:border-fitted-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Order Summary & Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6 border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-fitted-gold" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-center text-xs p-2 rounded-xl bg-fitted-card/60">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-white font-bold truncate max-w-[140px]">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">Size {item.size} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-white font-bold">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-fitted-gold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleInitiateRazorpay}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-glow-gold/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isProcessing ? 'Connecting Gateway...' : 'Pay with Razorpay'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <Lock className="w-3.5 h-3.5 text-fitted-gold" />
              <span>Razorpay Ready • 256-bit Encrypted SSL</span>
            </div>

          </div>
        </div>

      </div>

      {/* Razorpay Test Modal Simulation */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161722] border border-blue-500/40 rounded-3xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            
            {/* Razorpay Branding Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">Razorpay</span>
                <span className="text-xs font-bold text-white">Test Mode Sandbox</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">${subtotal.toFixed(2)}</span>
            </div>

            {/* Test Card Simulation Details */}
            <div className="p-4 rounded-2xl bg-fitted-card border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Test Card Number:</span>
                <span className="font-mono text-white">4111 •••• •••• 1111</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Expiry:</span>
                <span className="font-mono text-white">12/28</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>CVV:</span>
                <span className="font-mono text-white">123</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Enter Test 3D-Secure OTP</label>
              <input
                type="text"
                value={testOtp}
                onChange={(e) => setTestOtp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-fitted-card border border-white/20 text-white text-center font-mono tracking-widest text-sm"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSimulatePaymentSuccess}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying Signature...' : 'Simulate Successful Payment'}</span>
              </button>

              <button
                onClick={() => setRazorpayModalOpen(false)}
                className="w-full text-center text-xs text-gray-400 hover:text-white py-1"
              >
                Cancel Transaction
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
