import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { BookOpen, Clock, Award } from "lucide-react";

export default function MyCourses() {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // New: Track errors

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await API.get('/api/enrollments/my-courses');
                
                // SAFETY: Ensure we always have an array, even if the API returns something weird
                const data = Array.isArray(res.data) ? res.data : [];
                console.log("Enrollments fetched:", data); 
                
                setEnrollments(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch enrollments:", err);
                setError("Could not load your courses. Please try again later.");
                setEnrollments([]); // Fallback to empty array to prevent .map crashes
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchEnrollments();
        } else {
            setLoading(false);
        }
    }, [user]);

    // If user is not logged in, redirect or show message
    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1D1F23] mb-4">Please log in to view your courses.</h2>
                    <Link to="/login" className="text-[#461EA4] font-semibold hover:underline">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F7F9] py-10">
            <div className="max-w-[1280px] mx-auto px-6">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-extrabold text-[#1D1F23]">My Learning</h1>
                    <p className="text-[14px] text-[#595C61] mt-1">Welcome back, {user?.name || 'Student'}. Here are the courses you are currently taking.</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Course List */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-[#595C61]">Loading your courses...</div>
                ) : enrollments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-xl border border-[#DFE1E4] border-dashed p-10">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 bg-[#F6F7F9] rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-[#9CA3AF]" />
                            </div>
                            <h2 className="text-[22px] font-bold text-[#1D1F23] mb-2">You haven't enrolled in any courses yet.</h2>
                            <p className="text-[14px] text-[#595C61] mb-8">Start your learning journey today!</p>

                            <Link
                                to="/courses"
                                className="inline-flex items-center justify-center h-12 px-8 bg-[#461EA4] text-white rounded-[12px] font-semibold hover:bg-[#3a188a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Browse Catalog
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => {
                            const course = enrollment.course;

                            // SAFETY CHECK: If the course was deleted, skip it entirely
                            if (!course) return null;

                            const progress = enrollment.progress || 0;

                            return (
                                <Link
                                    key={enrollment._id}
                                    to={`/learn/${course._id}`}
                                    className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden hover:shadow-md transition-all group flex flex-col"
                                >
                                    <img
                                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop"}
                                        alt={course.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-5 flex flex-col flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#461EA4] bg-[#461EA4]/10 px-2 py-1 rounded-full w-fit mb-3">
                                            {course.category}
                                        </span>
                                        <h3 className="text-[16px] font-bold text-[#1D1F23] mb-2 line-clamp-2">{course.title}</h3>

                                        {/* Progress Bar */}
                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center justify-between text-[12px] text-[#595C61] mb-1.5">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {progress}% Complete</span>
                                                <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Certificate</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#461EA4] rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}