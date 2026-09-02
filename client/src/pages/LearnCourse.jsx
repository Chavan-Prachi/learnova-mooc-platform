import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { Video, FileText, HelpCircle, FlaskConic, Presentation, File, CheckCircle } from "lucide-react";

export default function LearnCourse() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        // Check if user is enrolled
        await API.get(`/api/enrollments/check/${id}`);
        setIsEnrolled(true);
      } catch (error) {
        alert("You need to enroll in this course to access it!");
        navigate(`/course/${id}`);
      }
    };

    if (user) {
      checkEnrollment();
    } else {
      navigate("/login");
    }
  }, [id, user, navigate]);


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/api/courses/${id}`);
        setCourse(res.data);
        if (res.data.lessons?.length > 0) {
          setSelectedLesson(res.data.lessons[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleQuizSubmit = async () => {
    try {
      const res = await API.post(`/api/courses/${id}/lessons/${selectedLesson._id}/quiz-submit`, {
        answers: Object.values(quizAnswers)
      });
      setQuizResult(res.data);
    } catch (error) {
      alert("Failed to submit quiz");
    }
  };

  const getLessonIcon = (type) => {
    const icons = {
      video: <Video className="w-4 h-4" />,
      ebook: <FileText className="w-4 h-4" />,
      quiz: <HelpCircle className="w-4 h-4" />,
      lab: <FlaskConic className="w-4 h-4" />,
      notes: <File className="w-4 h-4" />,
      ppt: <Presentation className="w-4 h-4" />
    };
    return icons[type] || <File className="w-4 h-4" />;
  };

  if (!course) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="flex">
        {/* Sidebar - Lesson List */}
        <div className="w-80 h-screen bg-white border-r border-[#DFE1E4] overflow-y-auto sticky top-0">
          <div className="p-6 border-b border-[#DFE1E4]">
            <h2 className="text-[18px] font-bold text-[#1D1F23]">{course.title}</h2>
            <p className="text-[12px] text-[#595C61] mt-1">{course.lessons?.length || 0} lessons</p>
          </div>
          <div className="p-4 space-y-2">
            {course.lessons?.map((lesson, idx) => (
              <button
                key={lesson._id}
                onClick={() => { setSelectedLesson(lesson); setQuizResult(null); setQuizAnswers({}); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedLesson?._id === lesson._id ? 'bg-[#461EA4] text-white' : 'hover:bg-gray-100'
                  }`}
              >
                {getLessonIcon(lesson.type)}
                <div className="flex-1">
                  <p className="text-[13px] font-medium truncate">{lesson.title}</p>
                  <p className="text-[11px] opacity-70 capitalize">{lesson.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto h-screen">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-[28px] font-bold text-[#1D1F23] mb-2">{selectedLesson.title}</h1>
              <span className="inline-block px-3 py-1 bg-[#461EA4]/10 text-[#461EA4] text-[12px] font-bold rounded-full mb-6 capitalize">
                {selectedLesson.type} • {selectedLesson.module}
              </span>

              {/* VIDEO LECTURE */}
              {selectedLesson.type === 'video' && (
                <div className="bg-white rounded-xl border border-[#DFE1E4] overflow-hidden shadow-sm">
                  {selectedLesson.videoUrl ? (
                    // Check if the URL ends with a video file extension like .mp4
                    selectedLesson.videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video controls className="w-full aspect-video bg-black">
                        <source src={selectedLesson.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // Otherwise, treat it as an embed (YouTube, Vimeo, or Google Drive Preview)
                      <div className="aspect-video bg-black">
                        <iframe
                          src={selectedLesson.videoUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedLesson.title}
                        />
                      </div>
                    )
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-[#595C61] text-lg mb-2">No video URL provided for this lesson.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. PDF / EBOOK / PPT / NOTES */}
              {(selectedLesson.type === 'ebook' || selectedLesson.type === 'notes' || selectedLesson.type === 'ppt') && (
                <div className="bg-white rounded-xl p-6 border border-[#DFE1E4] shadow-sm">
                  {selectedLesson.fileUrl ? (
                    <div className="space-y-4">
                      {/* Top Action Bar */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📄</span>
                          <span className="font-semibold text-[#1D1F23]">Resource: {selectedLesson.title}</span>
                        </div>
                        <a
                          href={selectedLesson.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#461EA4] text-white text-sm rounded-lg font-semibold hover:bg-[#3a188a] transition-colors flex items-center gap-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          Open in New Tab
                        </a>
                      </div>

                      {/* Preview Area */}
                      <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          src={selectedLesson.fileUrl}
                          className="w-full h-full"
                          title={selectedLesson.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 text-center text-[#595C61]">
                      <p className="text-lg font-semibold mb-2">No file uploaded for this lesson.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. QUIZ */}
              {selectedLesson.type === 'quiz' && (
                <div className="bg-white rounded-xl p-6 border border-[#DFE1E4] shadow-sm">
                  {quizResult ? (
                    <div className="text-center py-10">
                      <div className="text-6xl mb-4">{quizResult.passed ? '🎉' : '📚'}</div>
                      <h2 className="text-[24px] font-bold mb-2">Quiz Complete!</h2>
                      <p className="text-[32px] font-extrabold text-[#461EA4] mb-2">{quizResult.score}%</p>
                      <p className={`text-[16px] font-semibold ${quizResult.passed ? 'text-green-600' : 'text-red-500'}`}>
                        {quizResult.passed ? `Passed! (Required: ${quizResult.passingScore}%)` : `Try Again (Required: ${quizResult.passingScore}%)`}
                      </p>
                      <button onClick={() => setQuizResult(null)} className="mt-6 px-6 py-2 bg-[#461EA4] text-white rounded-lg font-semibold hover:bg-[#3a188a]">Retake Quiz</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedLesson.quizData?.questions.map((q, idx) => (
                        <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="font-semibold text-[#1D1F23] mb-4">Q{idx + 1}: {q.question}</p>
                          <div className="space-y-3">
                            {q.options.map((opt, optIdx) => (
                              <label key={optIdx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-[#461EA4] transition-colors">
                                <input
                                  type="radio"
                                  name={`q${idx}`}
                                  checked={quizAnswers[idx] === optIdx}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                                  className="w-4 h-4 text-[#461EA4]"
                                />
                                <span className="text-[14px] text-[#374151]">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button onClick={handleQuizSubmit} className="w-full h-12 bg-[#461EA4] text-white rounded-xl font-semibold hover:bg-[#3a188a] transition-colors">Submit Quiz</button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. VIRTUAL LAB */}
              {selectedLesson.type === 'lab' && (
                <div className="bg-white rounded-xl p-6 border border-[#DFE1E4] shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🔬</span>
                    <h3 className="text-[18px] font-bold">Lab Environment: {selectedLesson.labConfig?.environment || 'General'}</h3>
                  </div>
                  <div className="prose max-w-none bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <p className="whitespace-pre-line text-[14px] text-[#374151] leading-relaxed">{selectedLesson.labConfig?.instructions || 'No instructions provided.'}</p>
                  </div>
                </div>
              )}

              {/* Additional Notes (Shows for all types if filled out) */}
              {selectedLesson.content && (
                <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-[16px] font-bold text-blue-900 mb-2">📝 Instructor Notes</h3>
                  <p className="text-[14px] text-blue-800 whitespace-pre-line leading-relaxed">{selectedLesson.content}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#595C61]">
              Select a lesson from the sidebar to begin learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}