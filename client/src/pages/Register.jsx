import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to student
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/'); // Redirect to home page on success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already be in use.');
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
          <h2 className="text-[28px] font-extrabold text-[#1D1F23]">Create your account</h2>
          <p className="text-[14px] text-[#595C61] mt-2 text-center">
            Start learning or teaching on Learnova today.
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
          
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-[#1D1F23]">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full h-12 px-4 text-[14px] text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4] transition-colors placeholder:text-[#595C61]" 
              required 
            />
          </div>

          {/* Email */}
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
          
          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-[#1D1F23]">Password</label>
            <input 
              type="password" 
              placeholder="Min. 6 characters" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full h-12 px-4 text-[14px] text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4] transition-colors placeholder:text-[#595C61]" 
              required 
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-[#1D1F23]">I want to...</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={role === 'student'} 
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#461EA4] w-4 h-4"
                />
                <span className="text-[14px] text-[#1D1F23]">Learn (Student)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  value="instructor" 
                  checked={role === 'instructor'} 
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#461EA4] w-4 h-4"
                />
                <span className="text-[14px] text-[#1D1F23]">Teach (Instructor)</span>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full h-12 flex items-center justify-center text-[16px] font-semibold text-[#F6F7F9] bg-[#461EA4] rounded-[12px] hover:bg-[#3a188a] transition-colors mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-[14px] text-[#595C61]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#461EA4] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;