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
import './Home.css';
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

const FEATURED_COURSES = [
  {
    title: "Advanced Data Analysis with Python & SQL",
    category: "DATA ANALYSIS",
    rating: 4.5,
    reviews: 1240,
    duration: "24 hours",
    price: "Free",
    isFree: true,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "Machine Learning Fundamentals & Neural Networks",
    category: "MACHINE LEARNING",
    rating: 4.4,
    reviews: 850,
    duration: "24 hours",
    price: "Free",
    isFree: true,
    img: "https://images.unsplash.com/photo-1762281429414-5ee5f2dbb243?w=400&h=220&fit=crop&auto=format",
  },
  {
    title: "Mastering AI Strategy for Modern Business",
    category: "ARTIFICIAL INTELLIGENCE",
    rating: 4.4,
    reviews: 2100,
    duration: "24 hours",
    price: "$49",
    isFree: false,
    img: "https://images.unsplash.com/photo-1737644467636-6b0053476bb2?w=400&h=220&fit=crop&auto=format",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">

      {/* ===== HERO SECTION ===== */}
      <section className="max-w-[1440px] mx-auto px-12 pt-12 pb-10 grid grid-cols-2 gap-16 items-center">   {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="w-fit">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold text-[#4338CA] bg-[#4338CA]/5 border border-[#4338CA]/20 uppercase tracking-wider">
              Start Learning Today
            </span>
          </div>

          <h1 className="text-[56px] leading-[64px] font-extrabold text-[#1D1F23] font-jakarta">
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
        <div>
          <div className="image-wrapper">
            <div className="image-rectangle"></div>
            <div className="image-container">
              <img src={vislyImage} alt="Illustration" className="illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BANNER ===== */}
      <section className="max-w-[1440px] mx-auto px-12 pb-20">
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
      <section className="max-w-[1440px] mx-auto px-12 pb-20">
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

      {/* ===== FEATURED COURSES ===== */}
      <section className="max-w-[1440px] mx-auto px-12 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-extrabold text-[#1D1F23]">Featured Courses</h2>
          <Link to="/courses" className="text-[14px] font-semibold text-[#461EA4] hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_COURSES.map((course, i) => (
            <Link key={i} to="/course/machine-learning-fundamentals" className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden hover:shadow-md transition-all group">
              <div className="relative overflow-hidden">
                <img src={course.img} alt={course.title} className="w-full h-[170px] object-cover group-hover:scale-105 transition-transform duration-300"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                <span className="absolute top-3 left-3 bg-[#461EA4] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {course.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[14px] font-semibold text-[#1D1F23] leading-snug mb-3 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-2 mb-1.5">
                  <StarRating rating={course.rating} />
                  <span className="text-[12px] text-[#6B7280]">({course.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                  {course.duration}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[15px] font-bold ${course.isFree ? "text-[#F97316]" : "text-[#1D1F23]"}`}>
                    {course.price}
                  </span>
                  <button type="button" className="h-[32px] px-4 border border-[#461EA4] text-[#461EA4] hover:bg-[#461EA4] hover:text-white text-[12px] font-semibold rounded-full transition-all">
                    Enroll
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}