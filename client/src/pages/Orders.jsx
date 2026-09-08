import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const showSuccessMsg = location.state?.orderPlaced;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return <div className="text-center py-20"><Link to="/login" className="text-blue-600 hover:underline text-lg">Please log in to view your orders.</Link></div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-8">
      
      {showSuccessMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Your order has been placed successfully. Thank you for shopping with us!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6">
        <h1 className="text-3xl font-normal">Your Orders</h1>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <input type="text" placeholder="Search all orders" className="border border-gray-400 p-1 px-2 rounded-sm shadow-inner" />
          <button className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm">Search Orders</button>
        </div>
      </div>

      <div className="border-b mb-6 pb-2">
        <ul className="flex gap-6 text-sm font-medium">
          <li className="text-amazon-orange border-b-2 border-amazon-orange pb-2">Orders</li>
          <li className="text-blue-600 hover:text-amazon-orange hover:underline cursor-pointer">Buy Again</li>
          <li className="text-blue-600 hover:text-amazon-orange hover:underline cursor-pointer">Not Yet Shipped</li>
          <li className="text-blue-600 hover:text-amazon-orange hover:underline cursor-pointer">Cancelled Orders</li>
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white border rounded-lg">
            <h2 className="text-xl mb-4">You have not placed any orders yet.</h2>
            <Link to="/" className="bg-[#f0c14b] text-black px-4 py-2 rounded-md shadow-sm">Start Shopping</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Order Header */}
              <div className="bg-gray-100 p-4 border-b border-gray-300 flex flex-wrap justify-between gap-4 text-sm text-gray-600">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="uppercase font-medium">Order Placed</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="uppercase font-medium">Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="uppercase font-medium">Ship To</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">{order.shippingAddress.fullName} ▼</span>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="uppercase font-medium">Order # {order._id.substring(0, 10).toUpperCase()}-{order._id.substring(10, 17).toUpperCase()}</span>
                  <div className="flex gap-2 justify-end">
                    <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline cursor-pointer">View order details</Link>
                    <span className="text-gray-300">|</span>
                    <span className="text-blue-600 hover:underline cursor-pointer">Invoice</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4 text-green-700">{order.status === 'Pending' ? 'Preparing for Shipment' : order.status}</h3>
                
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full sm:w-24 flex-shrink-0 flex justify-center">
                      <img src={item.image} alt={item.title} className="max-h-24 object-contain" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.product}`} className="text-blue-600 hover:text-amazon-orange hover:underline font-medium block mb-1">
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 mb-1">Return eligible through {(new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <div className="flex gap-2 mt-2">
                        <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 py-1 px-3 rounded-md text-sm shadow-sm">Buy it again</button>
                        <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 py-1 px-3 rounded-md text-sm shadow-sm">View your item</button>
                      </div>
                    </div>
                    <div className="w-full sm:w-48 flex-shrink-0 flex flex-col gap-2">
                      <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 py-1 rounded-md text-sm shadow-sm text-center">Track package</button>
                      <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 py-1 rounded-md text-sm shadow-sm text-center">Write a product review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
