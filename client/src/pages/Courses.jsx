import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const RELATED_CATEGORIES = [
  "Python", "Statistics", "Business Intelligence", "R Programming", "Deep Learning", "Big Data", "Cloud Computing", "MLOps"
];

function StarRating({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states (UI ready for future backend filtering)
  const [levels, setLevels] = useState({ beginner: true, intermediate: true, advanced: true });
  const [languages, setLanguages] = useState({ english: true, spanish: false, french: false, japanese: false });
  const [duration, setDuration] = useState("any");
  const [priceRange, setPriceRange] = useState(299);
  const [minRating, setMinRating] = useState(4);
  const [sort, setSort] = useState("Most Popular");
  const [page, setPage] = useState(1);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle quick enroll directly from the catalog card
  const handleQuickEnroll = async (e, courseId) => {
    e.preventDefault(); // Stops the card's <Link> from navigating
    e.stopPropagation(); // Stops the click event from bubbling up

    if (!user) {
      alert("Please log in to enroll in this course!");
      navigate("/login");
      return;
    }

    try {
      await API.post(`/api/enrollments/${courseId}`);
      alert("Successfully enrolled! Go to 'My Learning' to start.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to enroll. You might already be enrolled!");
    }
  };

  // Fetch real courses from backend on mount
 // Fetch real courses from backend on mount
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await API.get('/api/courses');
      
      // FILTER OUT the mock "Complete Node.js Bootcamp" courses
      const filteredCourses = res.data.filter(
        course => course.title !== "Complete Node.js Bootcamp"
      );
      
      setCourses(filteredCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchCourses();
}, []);

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#5533CC] transition-colors">Home</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
          <Link to="/courses" className="hover:text-[#5533CC] transition-colors">Catalog</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
          <span className="text-[#374151] font-medium">Data Science</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#111827] mb-1">All Courses</h1>
            <p className="text-[14px] text-[#6B7280]">{courses.length} courses available to help you master the data landscape.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#6B7280]">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-[#E5E7EB] rounded-lg px-3 h-[36px] text-[13px] text-[#374151] bg-white focus:outline-none focus:border-[#5533CC] cursor-pointer"
            >
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (UI Only for now) */}
          <aside className="w-[200px] shrink-0 hidden md:block">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" /></svg>
                  Filters
                </div>
                <button className="text-[12px] font-semibold text-[#5533CC] hover:underline">Reset</button>
              </div>
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Level</p>
                {["beginner", "intermediate", "advanced"].map((l) => (
                  <label key={l} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                    <input type="checkbox" checked={levels[l]} onChange={() => setLevels(prev => ({ ...prev, [l]: !prev[l] }))} className="w-4 h-4 rounded border-[#5533CC] accent-[#5533CC]" />
                    <span className="text-[13px] text-[#374151] capitalize">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-[#6B7280] text-lg">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-[#6B7280] text-lg">No courses available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {courses.map((course) => {
                  const isFree = course.price === 0;
                  const displayPrice = isFree ? "Free" : `$${course.price}`;
                  const fallbackImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop";

                  return (
                    <Link
                      key={course._id}
                      to={`/course/${course._id}`}
                      className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={course.thumbnail || fallbackImg}
                          alt={course.title}
                          className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute top-2.5 left-2.5 bg-[#5533CC] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[13px] font-semibold text-[#111827] leading-snug mb-3 line-clamp-2 min-h-[38px]">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mb-1">
                          <StarRating rating={4.5} />
                          <span className="text-[11px] text-[#6B7280]">({course.lessons?.length || 0} lessons)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] mb-3">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                          Self-paced
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[14px] font-bold ${isFree ? "text-[#F97316]" : "text-[#111827]"}`}>
                            {displayPrice}
                          </span>
                          <button
                            onClick={(e) => handleQuickEnroll(e, course._id)}
                            className="h-[30px] px-4 border border-[#5533CC] text-[#5533CC] hover:bg-[#5533CC] hover:text-white text-[11px] font-semibold rounded-full transition-all"
                          >
                            Enroll
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mb-10">
              <button className="h-[36px] px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#6B7280] hover:border-[#5533CC] hover:text-[#5533CC] transition-all flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6" /></svg>
                Previous
              </button>
              <button className="w-[36px] h-[36px] rounded-lg bg-[#5533CC] text-white text-[13px] font-medium">1</button>
              <button className="h-[36px] px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#6B7280] hover:border-[#5533CC] hover:text-[#5533CC] transition-all flex items-center gap-1">
                Next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
              </button>
            </div>

            {/* Related categories */}
            <div className="mb-8">
              <h3 className="text-[18px] font-bold text-[#111827] mb-5 text-center">Explore Related Categories</h3>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {RELATED_CATEGORIES.map((cat) => (
                  <button key={cat} className="h-[34px] px-4 rounded-full border border-[#E5E7EB] bg-white text-[13px] text-[#374151] hover:border-[#5533CC] hover:text-[#5533CC] transition-all">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}