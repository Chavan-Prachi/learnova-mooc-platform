import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({ 0: true });
  const [wishlist, setWishlist] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Fetch course data on mount
     useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Course Details
        const courseRes = await API.get(`/api/courses/${id}`);
        setCourse(courseRes.data);

        // 2. Check if User is Enrolled in THIS specific course
        if (user) {
          try {
            // This hits the exact endpoint we built for this!
            await API.get(`/api/enrollments/check/${id}`);
            setIsEnrolled(true);
          } catch (err) {
            // If it returns 404, it means they aren't enrolled
            setIsEnrolled(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]); 

  const toggle = (i) => setOpenModules(prev => ({ ...prev, [i]: !prev[i] }));

  const handleEnroll = async () => {
    if (!user) {
      alert("Please log in to enroll in this course!");
      navigate("/login");
      return;
    }

    try {
      const res = await API.post(`/api/enrollments/${id}`);
      setEnrollStatus("success");
      setIsEnrolled(true);
      alert(res.data.message);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "";

      // If the backend says they are already enrolled, update the UI gracefully
      if (errorMsg.toLowerCase().includes("already enrolled")) {
        setIsEnrolled(true);
        alert("You are already enrolled in this course!");
      } else {
        setEnrollStatus("error");
        alert(errorMsg || "Failed to enroll. Please try again.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5FA]">Loading course details...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5FA]">Course not found.</div>;

  const isFree = course.price === 0;
  const displayPrice = isFree ? "Free" : `$${course.price}`;

  const curriculumModule = {
    title: "Course Content",
    lessons: course.lessons || []
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* Hero Banner - CLEAN & SIMPLE */}
      <div className="relative bg-[#1E1148] py-10">
        <div className="absolute inset-0 bg-[#1E1148]/90" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-white/60 mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-white font-semibold">{course.category}</span>
          </nav>

          {/* Just the Title - NO Description */}
          <h1 className="text-[40px] lg:text-[46px] font-bold text-white leading-tight mb-4 max-w-4xl">
            {course.title}
          </h1>

          {/* Quick Stats Only */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/70 mt-4">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
              <span className="text-white font-semibold">4.5</span>
              <span>(Estimated Rating)</span>
            </div>
            <div>Instructor: <span className="text-white font-semibold">{course.instructor?.name || "Learnova Instructor"}</span></div>
            <div>Lessons: <span className="text-white font-semibold">{course.lessons?.length || 0}</span></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* What you'll learn */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
              <h2 className="text-[18px] font-bold text-[#111827] mb-5">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Master foundational concepts",
                  "Build projects from scratch",
                  "Handle real-world scenarios",
                  "Optimize performance",
                  "Deploy to production",
                  "Industry-standard tools",
                  "Best practices & patterns",
                  "Lifetime access & updates",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 shrink-0 text-[#5533CC]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
                    <span className="text-[13px] text-[#374151] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Course Description */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
              <h2 className="text-[18px] font-bold text-[#111827] mb-4">About This Course</h2>
              <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* Curriculum */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-[#111827]">Course curriculum</h2>
                <span className="text-[12px] text-[#6B7280]">
                  {new Set(course.lessons?.map(l => l.module || "Day 1")).size} Days • {course.lessons?.length || 0} Total Lessons
                </span>
              </div>
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                {/* Group lessons by module/day */}
                {Array.from(new Set(course.lessons?.map(l => l.module || "Day 1"))).map((module, moduleIdx) => (
                  <div key={moduleIdx} className="border-b border-[#E5E7EB] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggle(moduleIdx)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#F9FAFB] transition-colors text-left"
                    >
                      <span className="text-[14px] font-semibold text-[#111827]">{module}</span>
                      <svg
                        className={`shrink-0 text-[#6B7280] transition-transform ${openModules[moduleIdx] ? "rotate-180" : ""}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>

                    {openModules[moduleIdx] && (
                      <div className="bg-[#FAFAFA]">
                        {course.lessons
                          .filter(lesson => (lesson.module || "Day 1") === module)
                          .map((lesson, j) => (
                            <div key={lesson._id || j} className="flex items-center gap-3 px-5 py-3 border-t border-[#F3F4F6]">
                              {/* Icon based on type */}
                              <span className="text-[#9CA3AF] shrink-0">
                                {lesson.type === 'video' && '🎥'}
                                {lesson.type === 'ppt' && '📊'}
                                {lesson.type === 'ebook' && '📚'}
                                {lesson.type === 'quiz' && '❓'}
                                {lesson.type === 'lab' && '🔬'}
                                {lesson.type === 'notes' && '📝'}
                              </span>
                              <span className="flex-1 text-[13px] text-[#374151] font-medium">{lesson.title}</span>
                              <span className="text-[12px] text-[#9CA3AF] shrink-0 capitalize bg-gray-200 px-2 py-0.5 rounded-full">{lesson.type}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-[#111827] mb-5">Instructor</h2>
              <div className="flex gap-5 bg-white p-5 rounded-xl border border-[#E5E7EB]">
                <div className="w-20 h-20 rounded-full bg-[#5533CC]/10 flex items-center justify-center shrink-0 text-[#5533CC] font-bold text-2xl">
                  {course.instructor?.name?.charAt(0) || "I"}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#5533CC] mb-0.5">{course.instructor?.name || "Learnova Instructor"}</h3>
                  <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Course Creator</p>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-[580px]">
                    Dedicated to providing high-quality, practical education to help you achieve your learning goals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[310px] shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden sticky top-[80px] shadow-sm">
              {/* Course preview */}
              <div className="relative">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1604591259403-81d6c9cf87d7?w=400&h=200&fit=crop&auto=format"}
                  alt="Course preview"
                  className="w-full h-[170px] object-cover"
                />
              </div>

              <div className="p-5">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-[28px] font-bold ${isFree ? "text-[#F97316]" : "text-[#111827]"}`}>{displayPrice}</span>
                </div>

                {/* Enroll Button */}
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                  className={`w-full h-[44px] text-[14px] font-semibold rounded-xl mb-3 transition-all ${isEnrolled
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-[#5533CC] hover:bg-[#4420B8] text-white"
                    }`}
                >
                  {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>

                {enrollStatus === "success" && !isEnrolled && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-[12px] rounded-xl mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                    Successfully enrolled!
                  </div>
                )}

                <p className="text-[11px] text-[#9CA3AF] text-center mb-5">Start learning today</p>

                {/* Includes */}
                <div className="mb-5">
                  <p className="text-[13px] font-semibold text-[#111827] mb-3">This course includes:</p>
                  {[
                    { icon: <><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" /></>, text: "On-demand video lessons" },
                    { icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /></>, text: "Downloadable resources" },
                    { icon: <><polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" /></>, text: "Coding exercises" },
                    { icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>, text: "Full lifetime access" },
                    { icon: <><circle cx="12" cy="8" r="7" /><polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" /></>, text: "Certificate of completion" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-2">
                      <svg className="text-[#5533CC] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {item.icon}
                      </svg>
                      <span className="text-[12px] text-[#374151]">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Wishlist / Share */}
                <div className="flex items-center justify-around border-t border-[#F3F4F6] pt-4">
                  <button
                    type="button"
                    onClick={() => setWishlist(!wishlist)}
                    className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#5533CC] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlist ? "#5533CC" : "none"} stroke={wishlist ? "#5533CC" : "currentColor"} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    Wishlist
                  </button>
                  <button type="button" className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#5533CC] transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}