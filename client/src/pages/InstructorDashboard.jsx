import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { Plus, BookOpen, Trash2, Edit, Video } from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: "", description: "", category: "Programming", price: "", thumbnail: ""
  });

  useEffect(() => {
    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
      alert("Access denied. Instructors only.");
      navigate("/");
    } else {
      fetchMyCourses();
    }
  }, [user, navigate]);

  const fetchMyCourses = async () => {
    try {
      const res = await API.get('/api/courses');
      const myCourses = res.data.filter(c => c.instructor._id === user._id);
      setCourses(myCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await API.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCourseData({ ...courseData, thumbnail: res.data.url });
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const finalPrice = courseData.price === "" ? 0 : Number(courseData.price);
    const payload = { ...courseData, price: finalPrice };

    try {
      if (isEditing && editCourseId) {
        await API.put(`/api/courses/${editCourseId}`, payload);
        alert("Course updated successfully!");
      } else {
        await API.post('/api/courses', payload);
        alert("Course created successfully!");
      }
      setCourseData({ title: "", description: "", category: "Programming", price: "", thumbnail: "" });
      setShowCourseForm(false);
      setIsEditing(false);
      setEditCourseId(null);
      fetchMyCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save course");
    }
  };

  const handleEditClick = (course) => {
    setCourseData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price === 0 ? "" : course.price,
      thumbnail: course.thumbnail || ""
    });
    setEditCourseId(course._id);
    setIsEditing(true);
    setShowCourseForm(true);
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Delete "${courseTitle}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/api/courses/${courseId}`);
      alert("Course deleted successfully!");
      fetchMyCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-extrabold text-[#1D1F23]">Instructor Dashboard</h1>
            <p className="text-[14px] text-[#595C61] mt-1">Welcome back, {user?.name}. Manage your courses.</p>
          </div>
          <button onClick={() => setShowCourseForm(true)} className="flex items-center gap-2 h-12 px-6 bg-[#461EA4] text-white rounded-[12px] font-semibold hover:bg-[#3a188a] transition-colors">
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-[#DFE1E4] border-dashed">
              <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#595C61] font-medium">You haven't created any courses yet.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden hover:shadow-md transition-all flex flex-col">
                <img src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop"} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#461EA4] bg-[#461EA4]/10 px-2 py-1 rounded-full w-fit mb-3">{course.category}</span>
                  <h3 className="text-[16px] font-bold text-[#1D1F23] mt-1 mb-2 line-clamp-2">{course.title}</h3>
                  
                  <div className="flex items-center justify-between text-[13px] text-[#595C61] mb-4 mt-auto">
                    <span>{course.lessons?.length || 0} {course.lessons?.length === 1 ? 'Lesson' : 'Lessons'}</span>
                    <span className="font-bold text-[#1D1F23]">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => navigate(`/instructor/course/${course._id}`)} 
                      className="w-full h-10 flex items-center justify-center gap-2 bg-[#461EA4] text-white rounded-[10px] text-[13px] font-semibold hover:bg-[#3a188a] transition-colors"
                    >
                      {course.lessons?.length === 0 ? (
                        <>
                          <Plus className="w-4 h-4" /> Add First Lesson
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4" /> Manage Lessons
                        </>
                      )}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(course)} 
                        className="flex-1 h-9 flex items-center justify-center gap-1 border border-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-100 transition-colors text-[12px] font-medium"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course._id, course.title)} 
                        className="h-9 px-3 border border-red-300 text-red-600 rounded-[10px] hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
              <h2 className="text-[24px] font-extrabold text-[#1D1F23] mb-6">{isEditing ? "Edit Course" : "Create New Course"}</h2>
              <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
                <input required placeholder="Course Title" value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />
                <textarea required placeholder="Course Description" value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} className="h-24 px-4 py-3 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4] resize-none" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={courseData.category} onChange={e => setCourseData({ ...courseData, category: e.target.value })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]">
                    <option>Programming</option><option>Data Science</option><option>Design</option><option>Business</option>
                  </select>
                  <input type="number" placeholder="0 for Free" value={courseData.price} onChange={e => setCourseData({ ...courseData, price: e.target.value === "" ? "" : Number(e.target.value) })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />
                </div>
                
                <div className="relative">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[12px] cursor-pointer transition-colors ${uploading ? 'bg-gray-100 cursor-not-allowed border-[#461EA4]' : courseData.thumbnail ? 'border-green-400 bg-green-50' : 'border-[#DFE1E4] bg-[#F6F7F9] hover:border-[#461EA4]'}`}>
                    {uploading ? (
                      <p className="text-[14px] text-[#461EA4] font-bold animate-pulse">⏳ Uploading... Please wait</p>
                    ) : courseData.thumbnail ? (
                      <div className="flex flex-col items-center">
                        <img src={courseData.thumbnail} alt="Preview" className="h-20 rounded-lg object-cover mb-2" />
                        <span className="text-[12px] text-green-600 font-semibold">Image Uploaded!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="text-[12px] text-[#595C61]">
                          <span className="font-semibold text-[#461EA4]">Click to upload</span> course thumbnail
                        </p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} />
                  </label>

                  {courseData.thumbnail && !uploading && (
                    <button type="button" onClick={() => setCourseData({ ...courseData, thumbnail: "" })} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors shadow-sm">✕</button>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setShowCourseForm(false); setIsEditing(false); setEditCourseId(null); }} className="flex-1 h-12 bg-gray-100 text-[#1D1F23] rounded-[12px] font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={uploading} className={`flex-1 h-12 text-white rounded-[12px] font-semibold transition-colors ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#461EA4] hover:bg-[#3a188a]'}`}>
                    {uploading ? 'Processing...' : (isEditing ? "Save Changes" : "Create Course")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}