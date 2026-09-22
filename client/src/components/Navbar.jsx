import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Search, FolderOpen } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinkClass = (path) => `
    px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200
    ${location.pathname === path 
      ? 'text-[#461EA4] bg-[#461EA4]/10' 
      : 'text-[#595C61] hover:text-[#461EA4] hover:bg-[#461EA4]/5'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 w-full h-[70px] bg-white/90 backdrop-blur-md border-b border-[#DFE1E4] shadow-sm">
      <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">

        {/* LEFT SIDE: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#461EA4] to-[#5533CC] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1D1F23]">Learnova</span>
          </Link>

          <ul className="hidden md:flex items-center gap-2">
            <li>
              <Link to="/courses" className={navLinkClass('/courses')}>
                Catalog
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link to="/my-courses" className={navLinkClass('/my-courses')}>
                    My Learning
                  </Link>
                </li>
                
                <li>
                  <Link to="/resources" className={`${navLinkClass('/my-resources')} flex items-center gap-1.5`}>
                    <FolderOpen className="w-4 h-4" />
                    Resources
                  </Link>
                </li>
              </>
            )}

            {(user?.role === 'instructor' || user?.role === 'admin') && (
              <li>
                <Link to="/instructor" className={navLinkClass('/instructor')}>
                  Teach
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* RIGHT SIDE: Search & Buttons */}
        <div className="flex items-center gap-4">
          <div className="relative w-[300px] h-10 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full h-full pl-10 pr-4 text-[14px] text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-xl outline-none focus:border-[#461EA4] focus:ring-2 focus:ring-[#461EA4]/20 transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {user ? (
            <>
              <span className="text-[14px] font-semibold text-[#1D1F23] hidden sm:block">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-4 h-10 flex items-center justify-center text-[14px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 h-10 flex items-center justify-center text-[14px] font-medium text-[#1D1F23] bg-transparent rounded-xl hover:bg-gray-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 h-10 flex items-center justify-center text-[14px] font-medium text-white bg-gradient-to-r from-[#461EA4] to-[#5533CC] rounded-xl hover:shadow-lg hover:shadow-[#461EA4]/25 transition-all"
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