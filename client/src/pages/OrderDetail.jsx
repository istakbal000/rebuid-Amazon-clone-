import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, CreditCard, ChevronRight } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Processing: 'bg-blue-100 text-blue-800 border-blue-300',
    Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    Delivered: 'bg-green-100 text-green-800 border-green-300',
  };
  return (
    <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-lg p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="max-w-screen-lg mx-auto p-8 text-center">
      <p className="text-red-600 text-lg mb-4">{error}</p>
      <Link to="/orders" className="text-blue-600 hover:underline">← Back to Orders</Link>
    </div>
  );

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/orders" className="hover:text-amber-600">Your Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700">Order Details</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-xs text-gray-500 mt-1">
            Order #{order._id.substring(0, 10).toUpperCase()}... ·{' '}
            Placed {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2"><Package className="h-4 w-4" /> Delivery Status</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                i <= stepIndex
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium text-center ${i <= stepIndex ? 'text-green-700' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold mb-4 text-lg">Items Ordered</h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain flex-shrink-0 bg-gray-50 rounded"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'; }}
                />
                <div className="flex-1">
                  <Link to={`/product/${item.product}`} className="text-sm font-medium text-blue-700 hover:text-amber-600 hover:underline block mb-1">
                    {item.title}
                  </Link>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold mt-1">${item.price.toFixed(2)} each</p>
                  <p className="text-xs text-gray-500">Line total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="font-bold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</h2>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="font-bold mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h2>
            <p className="text-sm text-gray-700">{order.paymentMethod}</p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="font-bold mb-3">Order Summary</h2>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
                <span>Order Total</span>
                <span className="text-red-700">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/orders" className="text-blue-600 hover:underline text-sm">← Back to Your Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetail;
