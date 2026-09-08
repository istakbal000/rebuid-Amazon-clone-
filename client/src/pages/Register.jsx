import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 bg-white min-h-screen">
      <Link to="/" className="mb-4">
        <span className="text-3xl font-bold tracking-tighter">amazon<span className="text-amazon-orange text-sm">.clone</span></span>
      </Link>

      <div className="border border-gray-300 rounded-md p-6 w-full max-w-sm mb-4">
        <h1 className="text-3xl font-normal mb-4">Create account</h1>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-bold">Your name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="First and last name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange shadow-inner"
              required 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-bold">Mobile number or email</label>
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
            <label htmlFor="password" className="text-sm font-bold">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange shadow-inner"
              required 
            />
            <div className="text-xs text-gray-600 flex items-center mt-1">
              <span className="text-blue-500 mr-1 italic">i</span> Passwords must be at least 6 characters.
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-bold">Re-enter password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange shadow-inner"
              required 
            />
          </div>

          <button type="submit" className="bg-[#f0c14b] hover:bg-[#f4d078] border border-[#a88734] rounded-sm py-1 shadow-sm text-sm mt-2">
            Continue
          </button>
        </form>

        <p className="text-xs mt-4">
          By creating an account, you agree to Amazon Clone's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-amazon-orange hover:underline">Sign in <span>▶</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
