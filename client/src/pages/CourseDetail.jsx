import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { Clock, Award, BookOpen, CheckCircle, PlayCircle } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Course Details
        const courseRes = await API.get(`/api/courses/${id}`);
        setCourse(courseRes.data);

        // 2. Check if User is Enrolled
        if (user) {
          try {
            const enrollRes = await API.get('/api/enrollments/my-courses');
            const isEnrolledInThis = enrollRes.data.some(e => e.course._id === id);
            setIsEnrolled(isEnrolledInThis);
          } catch (err) {
            console.error("Enrollment check failed", err);
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

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await API.post(`/api/enrollments/${id}`);
      setIsEnrolled(true);
      alert("Successfully enrolled! Start learning now.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const toggle = (idx) => {
    setOpenModules(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#461EA4] mx-auto mb-4"></div>
          <p className="text-[#595C61]">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1D1F23] mb-4">Course not found</h2>
          <Link to="/courses" className="text-[#461EA4] font-semibold hover:underline">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Hero Section (Clean & Minimal) */}
      <div className="bg-gradient-to-br from-[#461EA4] to-[#5533CC] text-white py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[12px] font-semibold mb-4">
                {course.category}
              </span>
              <h1 className="text-[36px] font-bold mb-4 leading-tight">{course.title}</h1>
              
              <div className="flex items-center gap-4 text-[13px] text-white/90">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.lessons?.length || 0} Lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
            
            {course.thumbnail && (
              <div className="hidden md:block">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="rounded-xl shadow-2xl border-4 border-white/10 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About this course (Moved here for better readability) */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <h2 className="text-[20px] font-bold text-[#111827] mb-4">About this course</h2>
              <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-line">
                {course.description || "No description available for this course."}
              </p>
            </div>

            {/* Course Curriculum */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-[#111827]">Course curriculum</h2>
                <span className="text-[12px] text-[#6B7280]">
                  {new Set(course.lessons?.map(l => l.module || "Day 1")).size} Days • {course.lessons?.length || 0} Total Lessons
                </span>
              </div>
              
              {course.lessons && course.lessons.length > 0 ? (
                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                  {Array.from(new Set(course.lessons.map(l => l.module || "Day 1"))).map((module, moduleIdx) => (
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
                                <span className="text-[#9CA3AF] shrink-0">
                                  {lesson.type === 'video' && '🎥'}
                                  {lesson.type === 'ppt' && '📊'}
                                  {lesson.type === 'ebook' && '📚'}
                                  {lesson.type === 'quiz' && '❓'}
                                  {lesson.type === 'lab' && '🔬'}
                                  {lesson.type === 'notes' && '📝'}
                                </span>
                                <span className="flex-1 text-[13px] text-[#374151] font-medium">{lesson.title}</span>
                                <span className="text-[11px] text-[#6B7280] shrink-0 capitalize bg-gray-200 px-2 py-0.5 rounded-full">{lesson.type}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center shadow-sm">
                  <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                  <p className="text-[#595C61]">No lessons available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sticky top-6 shadow-sm">
              <div className="text-[32px] font-bold text-[#111827] mb-4">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </div>
              
              {isEnrolled ? (
                <Link
                  to={`/learn/${id}`}
                  className="w-full h-[44px] bg-green-500 hover:bg-green-600 text-white text-[14px] font-semibold rounded-xl mb-3 transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Learning
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`w-full h-[44px] text-white text-[14px] font-semibold rounded-xl mb-3 transition-all ${
                    enrolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5533CC] hover:bg-[#4420B8]'
                  }`}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              
              <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                <div className="flex items-center gap-2 text-[13px] text-[#374151] mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#374151] mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Self-paced learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}