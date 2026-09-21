import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Database,
  BarChart3,
  Palette,
  Code,
  DollarSign,
  Heart,
  Camera,
  Monitor
} from "lucide-react";
import API from "../api";
import './Home.css';

// Assets
import vislyImage from "../assets/visily-image.png";
import student1 from "../assets/student1.webp";
import student2 from "../assets/student2.webp";
import student3 from "../assets/student3.webp";
import student4 from "../assets/student4.png";

const CATEGORIES = [
  { label: "Data Science", icon: Database, count: "680 courses" },
  { label: "Business", icon: BarChart3, count: "920 courses" },
  { label: "Design", icon: Palette, count: "540 courses" },
  { label: "Programming", icon: Code, count: "1,240 courses" },
  { label: "Marketing", icon: DollarSign, count: "380 courses" },
  { label: "Health", icon: Heart, count: "310 courses" },
  { label: "Photography", icon: Camera, count: "210 courses" },
  { label: "Finance", icon: Monitor, count: "420 courses" },
];

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const res = await API.get('/api/courses');
        // Safely handle the response and get the first 3 courses
        const coursesArray = Array.isArray(res.data) ? res.data : (res.data.courses || []);
        setFeaturedCourses(coursesArray.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* ===== HERO SECTION ===== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="w-fit">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold text-[#4338CA] bg-[#4338CA]/5 border border-[#4338CA]/20 uppercase tracking-wider">
              Start Learning Today
            </span>
          </div>

          <h1 className="text-[40px] md:text-[56px] leading-[1.1] font-extrabold text-[#1D1F23] font-jakarta">
            Learn Without Limits
          </h1>

          <p className="text-[16px] leading-[24px] text-[#595C61] max-w-[518px]">
            Earn certificates and degrees from world-class universities and top
            companies. Build your career with flexible, professional online courses.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Link
              to="/courses"
              className="w-[191px] h-12 flex items-center justify-center text-[16px] font-semibold text-[#F6F7F9] bg-[#461EA4] rounded-[12px] hover:bg-[#3a188a] transition-colors"
            >
              Explore Courses
            </Link>
            <button type="button" className="w-[150px] h-12 flex items-center justify-center text-[16px] font-semibold text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] hover:bg-gray-200 transition-colors">
              View Plans
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-6 border-t border-[#DFE1E4]">
            <div className="flex -space-x-3">
              {[student1, student2, student3, student4].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-[#F6F7F9] object-cover"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#1D1F23]">50k+ Happy Students</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#D97708] text-[#D97708]" />
                <span className="text-[12px] font-medium text-[#595C61]">4.9/5 Rating on Trustpilot</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Illustration) */}
        <div className="hidden lg:block">
          <div className="image-wrapper">
            <div className="image-rectangle"></div>
            <div className="image-container">
              <img src={vislyImage} alt="Illustration" className="illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BANNER ===== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <div className="bg-[#461EA4] rounded-2xl px-8 py-10 shadow-[0_8px_10px_rgba(0,0,0,0.1),0_20px_25px_rgba(0,0,0,0.1)]">
          <p className="text-center text-[12px] font-bold text-white/70 uppercase tracking-[2px] mb-8">
            Trusted by 1,000+ Leading Universities and Companies
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[Monitor, Code, Database, Palette, BarChart3, Heart].map((Icon, i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR CATEGORIES ===== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-[36px] font-extrabold text-[#1D1F23] mb-3">
            Explore Popular Categories
          </h2>
          <p className="text-[15px] text-[#595C61] max-w-[560px] mx-auto leading-relaxed">
            Discover various subjects taught by industry experts. From technology to business, find the perfect path for your career.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.label} to="/courses" className="bg-white rounded-xl p-5 border border-[#DFE1E4] hover:border-[#461EA4]/40 hover:shadow-md transition-all group cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-[#F3F4F6] flex items-center justify-center mb-3 group-hover:bg-[#461EA4]/10 transition-colors">
                  <Icon className="w-6 h-6 text-[#374151] group-hover:text-[#461EA4] transition-colors" strokeWidth={1.5} />
                </div>
                <p className="text-[13px] font-semibold text-[#1D1F23] group-hover:text-[#461EA4] transition-colors mb-1">{cat.label}</p>
                <p className="text-[11px] text-[#9CA3AF]">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED COURSES (DYNAMIC) ===== */}
      <section className="py-16 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-bold text-[#1D1F23]">Featured Courses</h2>
          <Link to="/courses" className="text-[#461EA4] font-semibold hover:underline flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#461EA4] mx-auto"></div>
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#DFE1E4] border-dashed">
            <p className="text-[#595C61] font-medium">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:border-[#461EA4]/40 transition-all duration-300 group flex flex-col"
              >  {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#461EA4] text-white text-[11px] font-bold uppercase tracking-wider rounded-full">
                      {course.category || "Programming"}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[16px] font-bold text-[#1D1F23] mb-2 line-clamp-2 min-h-[48px]">
                    {course.title}
                  </h3>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-xs text-[#595C61] mb-3 mt-auto">
                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                      </svg>
                      <span>{course.lessons?.length || 0} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Certificate</span>
                    </div>
                  </div>

                  {/* Price and Enroll Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#DFE1E4]">
                    <span className="text-[18px] font-bold text-[#461EA4]">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    <Link
                      to={`/course/${course._id}`}
                      className="px-4 py-2 border-2 border-[#461EA4] text-[#461EA4] rounded-lg text-[13px] font-semibold hover:bg-[#461EA4] hover:text-white transition-colors"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}