import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 bg-white min-h-screen">
      <Link to="/" className="mb-4">
        <span className="text-3xl font-bold tracking-tighter">amazon<span className="text-amazon-orange text-sm">.clone</span></span>
      </Link>

      <div className="border border-gray-300 rounded-md p-6 w-full max-w-sm">
        <h1 className="text-3xl font-normal mb-4">Sign in</h1>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email or mobile phone number</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange shadow-inner"
              required 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-bold flex justify-between">
              Password <span className="font-normal text-blue-600 hover:text-amazon-orange hover:underline cursor-pointer">Forgot your password?</span>
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange shadow-inner"
              required 
            />
          </div>

          <button type="submit" className="bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734] rounded-sm py-1 shadow-sm text-sm">
            Sign in
          </button>
        </form>

        <p className="text-xs mt-4">
          By continuing, you agree to Amazon Clone's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
        </p>
      </div>

      <div className="flex items-center w-full max-w-sm mt-6 mb-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-3 text-xs text-gray-500">New to Amazon?</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <Link to="/register" className="w-full max-w-sm text-center bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm py-1 shadow-sm text-sm">
        Create your Amazon account
      </Link>
    </div>
  );
};

export default Login;
