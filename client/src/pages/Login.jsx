import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redirect to home page on success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#DFE1E4] p-8 shadow-sm">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#461EA4] flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-[#F6F7F9]" />
          </div>
          <h2 className="text-[28px] font-extrabold text-[#1D1F23]">Welcome back</h2>
          <p className="text-[14px] text-[#595C61] mt-2 text-center">
            Log in to access your courses and track your progress.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-[12px] text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-[#1D1F23]">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full h-12 px-4 text-[14px] text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4] transition-colors placeholder:text-[#595C61]" 
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-[#1D1F23]">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full h-12 px-4 text-[14px] text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4] transition-colors placeholder:text-[#595C61]" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full h-12 flex items-center justify-center text-[16px] font-semibold text-[#F6F7F9] bg-[#461EA4] rounded-[12px] hover:bg-[#3a188a] transition-colors mt-2"
          >
            Log In
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-[14px] text-[#595C61]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#461EA4] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;