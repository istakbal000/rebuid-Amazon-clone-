import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, cartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New address form state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', street: '', city: '', state: '', zipCode: '', country: 'US'
  });

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [user, cart.items.length, navigate]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('/api/addresses');
      setAddresses(res.data.addresses);
      const defaultAddr = res.data.addresses.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (res.data.addresses.length > 0) setSelectedAddress(res.data.addresses[0]);
    } catch (err) {
      console.error('Error fetching addresses', err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/addresses', newAddr);
      setAddresses(res.data.addresses);
      setSelectedAddress(res.data.addresses[res.data.addresses.length - 1]);
      setShowNewAddress(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address');
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: selectedAddress,
        paymentMethod
      };
      
      const res = await axios.post('/api/orders', orderData);
      clearCart();
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Checkout Header */}
      <header className="bg-gray-100 border-b p-4 flex justify-between items-center max-w-screen-xl mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-amazon-dark">
          amazon<span className="text-amazon-orange text-xs">.clone</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-medium">Checkout (<span className="text-amazon-orange">{cartItemCount} items</span>)</h1>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      <div className="max-w-screen-xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
        
        {/* Main Checkout Area */}
        <div className="flex-grow flex flex-col gap-6">
          {error && <div className="bg-red-100 text-red-700 p-4 border border-red-400 rounded-sm">{error}</div>}
          
          {/* Step 1: Address */}
          <div className={`border rounded-sm ${step === 1 ? 'border-amazon-orange shadow-sm' : 'border-gray-300'}`}>
            <div className={`p-4 font-bold text-lg flex justify-between ${step === 1 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className={step === 1 ? 'text-amazon-orange' : 'text-gray-800'}>1. Shipping address</span>
              {step > 1 && <button onClick={() => setStep(1)} className="text-sm font-normal text-blue-600 hover:underline">Change</button>}
            </div>
            
            {step === 1 && (
              <div className="p-4 pt-0 border-t mt-2">
                {addresses.length > 0 && !showNewAddress ? (
                  <div className="flex flex-col gap-3 mt-4">
                    {addresses.map(addr => (
                      <label key={addr._id} className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer ${selectedAddress?._id === addr._id ? 'bg-orange-50 border-amazon-orange' : 'hover:bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddress?._id === addr._id} 
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-bold">{addr.fullName}</p>
                          <p className="text-sm">{addr.street}</p>
                          <p className="text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                          <p className="text-sm">{addr.country}</p>
                        </div>
                      </label>
                    ))}
                    
                    <button onClick={() => setShowNewAddress(true)} className="text-blue-600 hover:underline self-start mt-2">+ Add a new address</button>
                    
                    <div className="mt-4 bg-gray-100 p-4 rounded-sm flex items-center">
                      <button 
                        onClick={() => selectedAddress && setStep(2)}
                        disabled={!selectedAddress}
                        className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium ${selectedAddress ? 'bg-[#f0c14b] hover:bg-[#f4d078] border-[#a88734]' : 'bg-gray-300 text-gray-500'}`}
                      >
                        Use this address
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddAddress} className="mt-4 max-w-lg flex flex-col gap-3">
                    <h3 className="font-bold text-lg mb-2">Add a new address</h3>
                    <input type="text" placeholder="Full name" value={newAddr.fullName} onChange={(e) => setNewAddr({...newAddr, fullName: e.target.value})} className="border p-2 rounded-sm" required />
                    <input type="text" placeholder="Street address" value={newAddr.street} onChange={(e) => setNewAddr({...newAddr, street: e.target.value})} className="border p-2 rounded-sm" required />
                    <div className="flex gap-2">
                      <input type="text" placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({...newAddr, city: e.target.value})} className="border p-2 rounded-sm flex-1" required />
                      <input type="text" placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({...newAddr, state: e.target.value})} className="border p-2 rounded-sm w-24" required />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="ZIP Code" value={newAddr.zipCode} onChange={(e) => setNewAddr({...newAddr, zipCode: e.target.value})} className="border p-2 rounded-sm flex-1" required />
                      <input type="text" placeholder="Country" value={newAddr.country} onChange={(e) => setNewAddr({...newAddr, country: e.target.value})} className="border p-2 rounded-sm flex-1" required />
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button type="submit" className="bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734] py-1 px-4 rounded-sm shadow-sm text-sm font-medium">Add address</button>
                      {addresses.length > 0 && <button type="button" onClick={() => setShowNewAddress(false)} className="text-blue-600 hover:underline">Cancel</button>}
                    </div>
                  </form>
                )}
              </div>
            )}
            {step > 1 && selectedAddress && (
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600">
                {selectedAddress.fullName}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`border rounded-sm ${step === 2 ? 'border-amazon-orange shadow-sm' : 'border-gray-300'}`}>
            <div className={`p-4 font-bold text-lg flex justify-between ${step === 2 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className={step === 2 ? 'text-amazon-orange' : 'text-gray-800'}>2. Payment method</span>
              {step > 2 && <button onClick={() => setStep(2)} className="text-sm font-normal text-blue-600 hover:underline">Change</button>}
            </div>
            
            {step === 2 && (
              <div className="p-4 border-t mt-2 flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${paymentMethod === 'Credit Card' ? 'bg-orange-50 border-amazon-orange' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'Credit Card'} onChange={() => setPaymentMethod('Credit Card')} />
                  <span className="font-medium">Credit or debit card (Mock)</span>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${paymentMethod === 'Cash on Delivery' ? 'bg-orange-50 border-amazon-orange' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} />
                  <span className="font-medium">Cash on Delivery</span>
                </label>

                <div className="mt-4 bg-gray-100 p-4 rounded-sm flex items-center">
                  <button 
                    onClick={() => setStep(3)}
                    className="bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734] py-2 px-4 rounded-md shadow-sm text-sm font-medium"
                  >
                    Use this payment method
                  </button>
                </div>
              </div>
            )}
            {step > 2 && (
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600">
                {paymentMethod}
              </div>
            )}
          </div>

          {/* Step 3: Review */}
          <div className={`border rounded-sm ${step === 3 ? 'border-amazon-orange shadow-sm' : 'border-gray-300'}`}>
            <div className={`p-4 font-bold text-lg ${step === 3 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className={step === 3 ? 'text-amazon-orange' : 'text-gray-800'}>3. Review items and shipping</span>
            </div>
            
            {step === 3 && (
              <div className="p-4 border-t mt-2">
                <div className="border border-gray-300 rounded-lg p-4">
                  <h3 className="font-bold mb-4 text-green-700 text-lg">Delivery: Tomorrow</h3>
                  <div className="flex flex-col gap-4">
                    {cart.items.map(item => (
                      <div key={item._id} className="flex gap-4">
                        <img src={item.product?.images?.[0]} alt="" className="w-16 h-16 object-contain" />
                        <div>
                          <p className="font-bold">{item.product?.title}</p>
                          <p className="text-sm font-bold text-red-700">${item.price.toFixed(2)}</p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="border border-gray-300 p-4 rounded-sm sticky top-4">
            <button 
              onClick={placeOrder}
              disabled={step !== 3 || loading}
              className={`w-full py-3 rounded-md shadow-sm text-sm font-bold mb-4 transition-colors ${step === 3 && !loading ? 'bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              {loading ? 'Processing...' : 'Place your order'}
            </button>
            <p className="text-xs text-center text-gray-600 mb-4 border-b pb-4">
              By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
            </p>
            
            <h3 className="font-bold text-lg mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Items:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Shipping & handling:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Total before tax:</span>
              <span>${(subtotal + shipping).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 border-b pb-2">
              <span>Estimated tax to be collected:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-red-700">
              <span>Order total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
