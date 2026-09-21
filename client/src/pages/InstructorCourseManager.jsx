import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { ArrowLeft, Plus, Trash2, Edit, Video, FileText, HelpCircle, FlaskConical, Presentation, File } from "lucide-react";

export default function InstructorCourseManager() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [openModules, setOpenModules] = useState({});

    const toggleModule = (module) => setOpenModules(prev => ({ ...prev, [module]: !prev[module] }));

    const [lessonData, setLessonData] = useState({
        title: "",
        module: "Day 1",
        type: "video",
        videoUrl: "",
        content: "",
        duration: "",
        fileUrl: "",
        quizData: { questions: [], passingScore: 70 },
        labConfig: { environment: "", instructions: "", resources: [] }
    });

    useEffect(() => {
        if (!user || (user.role !== "instructor" && user.role !== "admin")) {
            alert("Access denied. Instructors only.");
            navigate("/");
        } else {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await API.get(`/api/courses/${courseId}`);
            setCourse(res.data);
        } catch (error) {
            console.error("Failed to fetch course:", error);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();

        // ✅ FIX: Include quizData and labConfig in the payload so they actually save!
        const lessonPayload = {
            title: lessonData.title,
            module: lessonData.module,
            type: lessonData.type,
            videoUrl: lessonData.videoUrl || "",
            content: lessonData.content || "",
            duration: lessonData.duration === "" ? 0 : Number(lessonData.duration),
            fileUrl: lessonData.fileUrl || "",
            quizData: lessonData.type === 'quiz' ? lessonData.quizData : undefined,
            labConfig: lessonData.type === 'lab' ? lessonData.labConfig : undefined
        };

        try {
            if (editingLessonId) {
                await API.put(`/api/courses/${courseId}/lessons/${editingLessonId}`, lessonPayload);
                alert("Lesson updated successfully!");
            } else {
                await API.post(`/api/courses/${courseId}/lessons`, lessonPayload);
                alert("Lesson added successfully!");
            }
            resetLessonForm();
            fetchCourse();
        } catch (error) {
            console.error("Lesson save error:", error);
            alert(error.response?.data?.message || "Failed to save lesson.");
        }
    };

    const handleEditLesson = (lesson) => {
        setLessonData({
            title: lesson.title,
            module: lesson.module || "Day 1",
            type: lesson.type,
            videoUrl: lesson.videoUrl || "",
            content: lesson.content || "",
            duration: lesson.duration || "",
            fileUrl: lesson.fileUrl || "",
            quizData: lesson.quizData || { questions: [], passingScore: 70 },
            labConfig: lesson.labConfig || { environment: "", instructions: "", resources: [] }
        });
        setEditingLessonId(lesson._id);
        setShowLessonForm(true);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Delete this lesson?")) return;
        try {
            await API.delete(`/api/courses/${courseId}/lessons/${lessonId}`);
            alert("Lesson deleted successfully!");
            fetchCourse();
        } catch (error) {
            alert("Failed to delete lesson");
        }
    };

    const resetLessonForm = () => {
        setLessonData({
            title: "", module: "Day 1", type: "video", videoUrl: "", content: "", duration: "",
            fileUrl: "", quizData: { questions: [], passingScore: 70 },
            labConfig: { environment: "", instructions: "", resources: [] }
        });
        setShowLessonForm(false);
        setEditingLessonId(null);
    };

    // ✅ FIX: Added missing addQuizQuestion function
    const addQuizQuestion = () => {
        setLessonData({
            ...lessonData,
            quizData: {
                ...lessonData.quizData,
                questions: [
                    ...lessonData.quizData.questions,
                    { question: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }
                ]
            }
        });
    };

    // ✅ FIX: Added missing updateQuizQuestion function
    const updateQuizQuestion = (index, field, value) => {
        const updated = [...lessonData.quizData.questions];
        updated[index][field] = value;
        setLessonData({
            ...lessonData,
            quizData: {
                ...lessonData.quizData,
                questions: updated
            }
        });
    };

    const getLessonIcon = (type) => {
        const icons = {
            video: <Video className="w-4 h-4" />,
            ebook: <FileText className="w-4 h-4" />,
            quiz: <HelpCircle className="w-4 h-4" />,
            lab: <FlaskConical className="w-4 h-4" />,
            notes: <File className="w-4 h-4" />,
            ppt: <Presentation className="w-4 h-4" />
        };
        return icons[type] || <File className="w-4 h-4" />;
    };

    if (!course) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F6F7F9] py-10">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/instructor")}
                            className="flex items-center gap-2 text-[#595C61] hover:text-[#461EA4] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-semibold">Back to Dashboard</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setShowLessonForm(true)}
                        className="flex items-center gap-2 h-12 px-6 bg-[#461EA4] text-white rounded-[12px] font-semibold hover:bg-[#3a188a] transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add New Lesson
                    </button>
                </div>

                {/* Course Info */}
                <div className="bg-white rounded-xl border border-[#DFE1E4] p-6 mb-8">
                    <div className="flex items-start gap-6">
                        <img
                            src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop"}
                            alt={course.title}
                            className="w-48 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-[28px] font-bold text-[#1D1F23] mb-2">{course.title}</h1>
                            <p className="text-[14px] text-[#595C61] mb-3">{course.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="px-3 py-1 bg-[#461EA4]/10 text-[#461EA4] rounded-full font-semibold">{course.category}</span>
                                <span className="font-bold text-[#1D1F23]">{course.lessons?.length || 0} Lessons</span>
                                <span className="font-bold text-[#1D1F23]">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clean Accordion Curriculum UI */}
                <div className="bg-white rounded-xl border border-[#DFE1E4] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[20px] font-bold text-[#1D1F23]">Course Curriculum</h2>
                        <span className="text-sm text-[#595C61]">
                            {Object.keys(course.lessons?.reduce((acc, l) => { acc[l.module || 'Day 1'] = true; return acc; }, {}) || {}).length} Days • {course.lessons?.length || 0} Total Lessons
                        </span>
                    </div>

                    {course.lessons?.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-[#DFE1E4] rounded-xl">
                            <Video className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                            <h3 className="text-[18px] font-bold text-[#1D1F23] mb-2">No lessons yet</h3>
                            <p className="text-[#595C61] mb-6">Start by adding your first lesson to this course</p>
                            <button
                                onClick={() => setShowLessonForm(true)}
                                className="inline-flex items-center gap-2 h-12 px-6 bg-[#461EA4] text-white rounded-[12px] font-semibold hover:bg-[#3a188a] transition-colors"
                            >
                                <Plus className="w-5 h-5" /> Add First Lesson
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Group lessons by module */}
                            {Object.entries(
                                course.lessons.reduce((acc, lesson) => {
                                    const module = lesson.module || "Day 1";
                                    if (!acc[module]) acc[module] = [];
                                    acc[module].push(lesson);
                                    return acc;
                                }, {})
                            ).map(([module, lessons]) => (
                                <div key={module} className="border border-[#DFE1E4] rounded-lg bg-white overflow-hidden">
                                    {/* Module Header (Clickable) */}
                                    <button
                                        onClick={() => toggleModule(module)}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F6F7F9] transition-colors text-left"
                                    >
                                        <span className="font-semibold text-[#1D1F23]">{module}</span>
                                        <svg
                                            className={`w-5 h-5 text-[#595C61] transition-transform duration-200 ${openModules[module] ? 'rotate-180' : ''}`}
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>

                                    {/* Expanded Lessons List */}
                                    {openModules[module] && (
                                        <div className="px-4 pb-4 space-y-2 border-t border-[#DFE1E4] pt-3 bg-[#FAFAFA]">
                                            {lessons.map((lesson) => (
                                                <div key={lesson._id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#DFE1E4] hover:shadow-sm transition-shadow">
                                                    <div className="text-[#461EA4] shrink-0">
                                                        {getLessonIcon(lesson.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-[#1D1F23] truncate">{lesson.title}</h4>
                                                        <p className="text-xs text-[#595C61] capitalize">{lesson.type} • {lesson.duration || 0} mins</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleEditLesson(lesson)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-[#461EA4] border border-[#461EA4] rounded-lg hover:bg-[#461EA4] hover:text-white transition-colors text-xs font-semibold"
                                                    >
                                                        <Edit className="w-3 h-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLesson(lesson._id)}
                                                        className="p-1.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Lesson Form Modal */}
                {showLessonForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl my-8">
                            <h2 className="text-[24px] font-extrabold text-[#1D1F23] mb-6">{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</h2>
                            <form onSubmit={handleAddLesson} className="flex flex-col gap-4">
                                <input required placeholder="Lesson Title" value={lessonData.title} onChange={e => setLessonData({ ...lessonData, title: e.target.value })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />

                                <select value={lessonData.module || "Day 1"} onChange={e => setLessonData({ ...lessonData, module: e.target.value })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]">
                                    <option value="Day 1">Day 1</option>
                                    <option value="Day 2">Day 2</option>
                                    <option value="Day 3">Day 3</option>
                                    <option value="Day 4">Day 4</option>
                                    <option value="Day 5">Day 5</option>
                                </select>

                                <select value={lessonData.type} onChange={e => setLessonData({ ...lessonData, type: e.target.value })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]">
                                    <option value="video">🎥 Video Lecture</option>
                                    <option value="ebook">📚 E-Book / PDF</option>
                                    <option value="ppt">📊 Lecture PPT</option>
                                    <option value="notes">📝 Revision Notes</option>
                                    <option value="quiz">❓ Quiz / Assessment</option>
                                    <option value="lab">🔬 Virtual Lab</option>
                                </select>

                                {lessonData.type === 'video' && (
                                    <>
                                        <div>
                                            <input required placeholder="Paste YouTube Video URL" value={lessonData.videoUrl} onChange={e => setLessonData({ ...lessonData, videoUrl: e.target.value })} className="w-full h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />
                                            <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">Use YouTube links (e.g., https://youtube.com/watch?v=...)</p>
                                        </div>
                                        <input required type="number" placeholder="Duration (mins)" value={lessonData.duration} onChange={e => setLessonData({ ...lessonData, duration: e.target.value === "" ? "" : Number(e.target.value) })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />
                                    </>
                                )}

                                {(lessonData.type === 'ebook' || lessonData.type === 'notes' || lessonData.type === 'ppt') && (
                                    <div>
                                        <input required placeholder="Paste Google Drive or Document URL" value={lessonData.fileUrl} onChange={e => setLessonData({ ...lessonData, fileUrl: e.target.value })} className="w-full h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] outline-none focus:border-[#461EA4]" />
                                        <p className="text-[11px] text-[#9CA3AF] mt-1 ml-1">Make sure the Google Drive link is set to "Anyone with the link can view".</p>
                                    </div>
                                )}

                                {lessonData.type === 'quiz' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <label className="text-[14px] font-semibold">Passing Score (%):</label>
                                            <input type="number" value={lessonData.quizData.passingScore} onChange={e => setLessonData({ ...lessonData, quizData: { ...lessonData.quizData, passingScore: Number(e.target.value) } })} className="w-20 h-10 px-3 bg-[#F6F7F9] border border-[#DFE1E4] rounded-lg" />
                                        </div>
                                        {lessonData.quizData.questions.map((q, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-lg space-y-3">
                                                <input placeholder={`Question ${idx + 1}`} value={q.question} onChange={e => updateQuizQuestion(idx, 'question', e.target.value)} className="w-full h-10 px-3 bg-white border border-[#DFE1E4] rounded-lg" />
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                        <input type="radio" checked={q.correctAnswer === optIdx} onChange={() => updateQuizQuestion(idx, 'correctAnswer', optIdx)} />
                                                        <input placeholder={`Option ${optIdx + 1}`} value={opt} onChange={e => { const opts = [...q.options]; opts[optIdx] = e.target.value; updateQuizQuestion(idx, 'options', opts); }} className="flex-1 h-9 px-3 bg-white border border-[#DFE1E4] rounded-lg" />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <button type="button" onClick={addQuizQuestion} className="w-full h-10 bg-[#461EA4] text-white rounded-lg font-semibold">+ Add Question</button>
                                    </div>
                                )}

                                {lessonData.type === 'lab' && (
                                    <>
                                        <input placeholder="Lab Environment (e.g., Python, Linux)" value={lessonData.labConfig.environment} onChange={e => setLessonData({ ...lessonData, labConfig: { ...lessonData.labConfig, environment: e.target.value } })} className="h-12 px-4 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px]" />
                                        <textarea placeholder="Lab Instructions" value={lessonData.labConfig.instructions} onChange={e => setLessonData({ ...lessonData, labConfig: { ...lessonData.labConfig, instructions: e.target.value } })} className="h-24 px-4 py-3 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] resize-none" />
                                    </>
                                )}

                                <textarea placeholder="Additional Notes (optional)" value={lessonData.content} onChange={e => setLessonData({ ...lessonData, content: e.target.value })} className="h-20 px-4 py-3 bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] resize-none" />

                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={resetLessonForm} className="flex-1 h-12 bg-gray-100 text-[#1D1F23] rounded-[12px] font-semibold hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 h-12 bg-[#461EA4] text-white rounded-[12px] font-semibold hover:bg-[#3a188a]">{editingLessonId ? "Save Changes" : "Add Lesson"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}