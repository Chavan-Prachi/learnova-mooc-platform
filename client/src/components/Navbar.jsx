import { useContext } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Search } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  // Hooks MUST be inside the function component!
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 w-full h-[65px] bg-[#F6F7F9]/60 backdrop-blur-md border-b border-[#DFE1E4]">
      <div className="max-w-[1440px] mx-auto h-full px-12 flex items-center justify-between">

        {/* LEFT SIDE: Logo & Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#461EA4] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#F6F7F9]" />
            </div>
            <span className="text-[20px] font-bold text-[#1D1F23]">Learnova</span>
          </Link>


          <ul className="flex items-center gap-6">
            <li>
              <Link to="/courses">Catalog</Link>
            </li>

            {user && (
              <li>
                <Link to="/my-courses">My Learning</Link>
              </li>
            )}

            {(user?.role === 'instructor' || user?.role === 'admin') && (
              <li>
                <Link to="/instructor">Teach</Link>
              </li>
            )}

            <li>
              <a href="#">For Business</a>
            </li>
          </ul>

        </div>



        {/* RIGHT SIDE: Search & Buttons */}
        <div className="flex items-center gap-4">
          <div className="relative w-[280px] h-9 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#595C61]" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full h-full pl-[34px] pr-3 text-[14px] text-[#595C61] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[14px] outline-none focus:border-[#461EA4] transition-colors placeholder:text-[#595C61]"
            />
          </div>

          {/* Show Logout if logged in, otherwise show Login/Register */}
          {user ? (
            <>
              <span className="text-[14px] font-medium text-[#1D1F23] hidden sm:block">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="w-[74px] h-10 flex items-center justify-center text-[14px] font-medium text-red-600 bg-transparent rounded-[14px] border border-transparent hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-[74px] h-10 flex items-center justify-center text-[14px] font-medium text-[#1D1F23] bg-transparent rounded-[14px] hover:bg-gray-200/50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-[117px] h-9 flex items-center justify-center text-[14px] font-medium text-[#F6F7F9] bg-[#461EA4] rounded-[14px] hover:bg-[#3a188a] transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}