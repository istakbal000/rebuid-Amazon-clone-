import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <header className="bg-amazon-dark text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center pt-2 pb-1 px-2 border border-transparent hover:border-white rounded-sm">
          <span className="text-2xl font-bold tracking-tighter">amazon<span className="text-amazon-orange text-xs">.clone</span></span>
        </Link>

        {/* Deliver to */}
        <div className="hidden md:flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
          <MapPin className="h-5 w-5 mt-3 mr-1" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">Deliver to</span>
            <span className="text-sm font-bold">Select your address</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 mx-4 max-w-4xl h-10 rounded-md overflow-hidden bg-white">
          <select className="bg-gray-100 text-gray-700 text-sm px-2 border-r border-gray-300 focus:outline-none hidden lg:block">
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Amazon Clone" 
            className="flex-1 px-3 text-black focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-amazon-orange hover:bg-yellow-500 px-4 flex items-center justify-center transition-colors">
            <Search className="h-5 w-5 text-gray-900" />
          </button>
        </form>

        {/* Right Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Account */}
          <div className="px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer relative group">
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
              <span className="text-sm font-bold flex items-center">Account & Lists <span className="text-xs ml-1">▼</span></span>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-10 w-64 bg-white text-black p-4 rounded-md shadow-lg hidden group-hover:block z-50">
              {!user ? (
                <div className="text-center">
                  <Link to="/login" className="block bg-yellow-400 hover:bg-yellow-500 text-sm font-bold py-2 px-4 rounded-md mb-2">Sign in</Link>
                  <span className="text-xs">New customer? <Link to="/register" className="text-blue-600 hover:underline">Start here.</Link></span>
                </div>
              ) : (
                <div>
                  <div className="border-b pb-2 mb-2">
                    <p className="font-bold">Your Account</p>
                    <Link to="/orders" className="text-sm hover:text-amazon-orange hover:underline block mt-2">Your Orders</Link>
                    <Link to="/profile" className="text-sm hover:text-amazon-orange hover:underline block mt-2">Your Profile</Link>
                  </div>
                  <button onClick={logout} className="text-sm hover:text-amazon-orange hover:underline">Sign Out</button>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <Link to="/orders" className="hidden lg:flex flex-col px-2 py-1 border border-transparent hover:border-white rounded-sm">
            <span className="text-xs text-gray-300">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm">
            <div className="relative flex">
              <ShoppingCart className="h-8 w-8" />
              <span className="absolute top-0 left-3 bg-amazon-orange text-amazon-dark font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </div>
            <span className="text-sm font-bold mt-3 hidden sm:block">Cart</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-2">
        <form onSubmit={handleSearch} className="flex h-10 rounded-md overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder="Search Amazon" 
            className="flex-1 px-3 text-black focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-amazon-orange px-4 flex items-center justify-center">
            <Search className="h-5 w-5 text-gray-900" />
          </button>
        </form>
      </div>

      {/* Sub Bar */}
      <div className="bg-amazon-light flex items-center px-4 py-1 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button className="flex items-center mr-4 font-bold border border-transparent hover:border-white px-1 rounded-sm">
          <Menu className="h-5 w-5 mr-1" /> All
        </button>
        <Link to="/category/electronics" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Electronics</Link>
        <Link to="/category/books" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Books</Link>
        <Link to="/category/home-kitchen" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Home & Kitchen</Link>
        <Link to="/category/clothing" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Clothing</Link>
        <Link to="/category/toys" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Toys</Link>
        <Link to="/category/sports" className="mx-2 border border-transparent hover:border-white px-1 rounded-sm">Sports & Outdoors</Link>
      </div>
    </header>
  );
};

export default Header;
