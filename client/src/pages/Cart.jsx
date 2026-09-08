import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-[#eaeded] min-h-screen py-4 px-2 sm:px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-4">
        
        {/* Cart Items List */}
        <div className="flex-grow bg-white p-4 sm:p-6 shadow-sm rounded-sm">
          <h1 className="text-2xl sm:text-3xl font-medium border-b pb-4 mb-4">Shopping Cart</h1>
          
          {cart.items.length === 0 ? (
            <div className="py-8">
              <h2 className="text-xl font-medium mb-4">Your Amazon Cart is empty.</h2>
              <Link to="/" className="text-blue-600 hover:text-amazon-orange hover:underline">Continue shopping</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                  {/* Image */}
                  <div className="w-full sm:w-1/4 md:w-1/5 flex justify-center">
                    <img 
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                      alt={item.product?.title || 'Product'} 
                      className="max-h-32 object-contain"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-grow">
                    <Link to={`/product/${item.product?._id}`} className="text-lg font-medium text-blue-800 hover:text-amazon-orange line-clamp-2 mb-1">
                      {item.product?.title || 'Product details unavailable'}
                    </Link>
                    <p className="text-green-700 text-xs sm:text-sm mb-1">In Stock</p>
                    <p className="text-xs text-gray-500 mb-2">Eligible for FREE Shipping & FREE Returns</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-200 rounded-md border border-gray-300 shadow-sm overflow-hidden">
                        <select 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                          className="bg-gray-100 p-1 text-sm focus:outline-none"
                        >
                          {[...Array(Math.min(item.product?.stock || 10, 10)).keys()].map(x => (
                            <option key={x + 1} value={x + 1}>Qty: {x + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                      <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                      <button className="text-blue-600 text-sm hover:underline hidden sm:block">Save for later</button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="w-full sm:w-auto text-right mt-2 sm:mt-0 font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="text-right pt-2">
                <p className="text-lg">Subtotal ({cartItemCount} items): <span className="font-bold">${subtotal.toFixed(2)}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Subtotal & Checkout Sidebar */}
        {cart.items.length > 0 && (
          <div className="w-full lg:w-72 flex-shrink-0 bg-white p-4 shadow-sm rounded-sm h-fit">
            <div className="flex items-center gap-2 text-green-700 mb-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your order is eligible for FREE Delivery.</span>
            </div>
            
            <p className="text-lg mb-4">Subtotal ({cartItemCount} items): <span className="font-bold">${subtotal.toFixed(2)}</span></p>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734] py-2 rounded-md shadow-sm text-sm"
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
