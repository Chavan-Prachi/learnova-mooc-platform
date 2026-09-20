import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDays, setOpenDays] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewerError, setViewerError] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/api/courses/${id}`);
        setCourse(res.data);

        if (res.data.lessons && res.data.lessons.length > 0) {
          setSelectedLesson(res.data.lessons[0]);
          const firstModule = res.data.lessons[0].module || "Day 1";
          setOpenDays({ [firstModule]: true });
        }
      } catch (err) {
        console.error("Failed to load course:", err);
        setError("Could not load this course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleDay = (module) => {
    setOpenDays(prev => ({ ...prev, [module]: !prev[module] }));
  };

  // Convert Google Drive link to Google Docs Viewer URL (more reliable)
  const getVideoEmbedUrl = (url) => {
    if (!url) return "";

    // Check if it's a YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      console.error("Not a YouTube URL:", url);
      return "";
    }

    try {
      // Handle playlist URLs
      if (url.includes('list=')) {
        const playlistId = url.split('list=')[1].split('&')[0];
        return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
      }

      // Handle watch URLs: youtube.com/watch?v=VIDEO_ID
      const watchMatch = url.match(/[?&]v=([^&#]+)/);
      if (watchMatch && watchMatch[1]) {
        return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
      }

      // Handle short URLs: youtu.be/VIDEO_ID
      const shortMatch = url.match(/youtu\.be\/([^?&#/]+)/);
      if (shortMatch && shortMatch[1]) {
        return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;
      }

      // Handle embed URLs (already in correct format)
      if (url.includes('youtube.com/embed/')) {
        return url;
      }

      return url;
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return "";
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23,7 16,12 23,17 23,7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
      case 'ppt': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
      case 'ebook': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
      case 'quiz': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
      case 'notes': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>;
      default: return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#461EA4]"></div></div>;
  if (error || !course) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Course not found"}</div>;

  const lessonsByModule = course.lessons?.reduce((acc, lesson) => {
    const module = lesson.module || "Day 1";
    if (!acc[module]) acc[module] = [];
    acc[module].push(lesson);
    return acc;
  }, {}) || {};

  const isGoogleDrive = selectedLesson.fileUrl?.includes('drive.google.com');
  const viewerUrl = isGoogleDrive ? getViewerUrl(selectedLesson.fileUrl) : selectedLesson.fileUrl;

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-[#F6F7F9] overflow-hidden">

      {/* Top Header */}
      <header className="h-14 shrink-0 bg-[#1D1F23] text-white flex items-center justify-between px-4 md:px-6 shadow-md z-50">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-white/10 rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-bold truncate">{course.title}</h1>
          </div>
        </div>
        <button onClick={() => navigate("/my-courses")} className="text-xs md:text-sm text-gray-300 hover:text-white flex items-center gap-1 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" /></svg>
          <span className="hidden md:inline">Exit Course</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && <div className="fixed inset-0 top-14 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`
          fixed md:static top-14 md:top-0 left-0 bottom-0 
          w-[280px] md:w-[320px] shrink-0 bg-white border-r border-[#DFE1E4] 
          z-40 transform transition-transform duration-300 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}>
          <div className="p-4 border-b border-[#DFE1E4] flex justify-between items-center md:hidden">
            <span className="font-bold text-sm">Course Content</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 hidden md:block">Course Content</h2>
            {Object.entries(lessonsByModule).map(([module, lessons]) => (
              <div key={module} className="mb-4">
                <button onClick={() => toggleDay(module)} className="w-full flex items-center justify-between px-3 py-2 bg-[#F6F7F9] rounded-lg hover:bg-[#EEF0F3] text-left">
                  <span className="text-sm font-semibold text-[#1D1F23]">{module}</span>
                  <svg className={`text-[#9CA3AF] transition-transform ${openDays[module] ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
                </button>
                {openDays[module] && (
                  <div className="mt-2 space-y-1">
                    {lessons.map((lesson) => (
                      <button key={lesson._id} onClick={() => { setSelectedLesson(lesson); setSidebarOpen(false); setViewerError(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${selectedLesson?._id === lesson._id ? "bg-[#461EA4] text-white shadow-md" : "hover:bg-[#F6F7F9] text-[#374151]"}`}>
                        <span className={`shrink-0 ${selectedLesson?._id === lesson._id ? "text-white" : "text-[#9CA3AF]"}`}>{getLessonIcon(lesson.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className={`text-xs capitalize ${selectedLesson?._id === lesson._id ? "text-white/70" : "text-[#9CA3AF]"}`}>{lesson.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F6F7F9] p-4 md:p-8">
          {selectedLesson ? (
            <div className="max-w-5xl mx-auto pb-10">

              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1D1F23] mb-2">{selectedLesson.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#461EA4]/10 text-[#461EA4] text-xs font-bold rounded-full capitalize">
                      {getLessonIcon(selectedLesson.type)} {selectedLesson.type}
                    </span>
                    <span className="text-sm text-[#9CA3AF]">{selectedLesson.module || "Day 1"}</span>
                  </div>
                </div>
                {/* Always show Open button for file-based lessons */}
                {(selectedLesson.type === 'ebook' || selectedLesson.type === 'notes' || selectedLesson.type === 'ppt') && selectedLesson.fileUrl && (
                  <a
                    href={selectedLesson.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE1E4] text-[#461EA4] font-semibold rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    <span className="hidden md:inline">Open</span>
                  </a>
                )}
              </div>

              <div className="bg-white rounded-xl border border-[#DFE1E4] shadow-sm overflow-hidden">

                {/* VIDEO */}
                {selectedLesson.type === 'video' && selectedLesson.videoUrl ? (
                  <div className="aspect-video bg-black w-full relative">
                    <iframe
                      src={getVideoEmbedUrl(selectedLesson.videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedLesson.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full text-white p-8">
            <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h3 class="text-xl font-bold mb-2">Video cannot be embedded</h3>
            <p class="text-gray-300 mb-4 text-center">This video may be private or have embedding disabled.</p>
            <a href="${selectedLesson.videoUrl}" target="_blank" class="px-6 py-2 bg-[#461EA4] rounded-lg font-semibold hover:bg-[#3a188a]">
              Watch on YouTube
            </a>
          </div>
        `;
                      }}
                    />
                  </div>
                ) : selectedLesson.type === 'video' ? (
                  <div className="aspect-video bg-black flex items-center justify-center text-white">
                    <div className="text-center">
                      <p>No video URL provided</p>
                    </div>
                  </div>
                ) : null}

                {/* PDF/PPT/NOTES VIEWER */}
                {(selectedLesson.type === 'ebook' || selectedLesson.type === 'notes' || selectedLesson.type === 'ppt') && selectedLesson.fileUrl && (
                  viewerError ? (
                    // ERROR STATE
                    <div className="p-16 text-center">
                      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#1D1F23] mb-2">Unable to display document</h3>
                      <p className="text-gray-600 mb-6">Please open the file in a new tab to view it.</p>
                      <a
                        href={selectedLesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#461EA4] text-white font-semibold rounded-lg hover:bg-[#3a188a] transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        Open in New Tab
                      </a>
                      <button
                        onClick={() => setViewerError(false)}
                        className="block mt-4 mx-auto text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Try loading again
                      </button>
                    </div>
                  ) : (
                    // VIEWER with error handling
                    <div className="relative bg-white rounded-xl border border-[#DFE1E4] shadow-sm overflow-hidden" style={{ minHeight: '75vh' }}>
                      <iframe
                        src={viewerUrl}
                        className="w-full border-0 bg-white"
                        style={{ height: '80vh', minHeight: '600px' }}
                        title={selectedLesson.title}
                        onError={() => setViewerError(true)}
                      />
                    </div>
                  )
                )}

                {/* QUIZ / LAB */}
                {(selectedLesson.type === 'quiz' || selectedLesson.type === 'lab') && (
                  <div className="p-16 text-center text-[#595C61]">
                    <p className="text-lg font-semibold">{selectedLesson.type === 'quiz' ? 'Quiz' : 'Lab'} coming soon!</p>
                  </div>
                )}

              </div>

              {selectedLesson.content && (
                <div className="mt-8 bg-white rounded-xl p-6 border border-[#DFE1E4] shadow-sm">
                  <h4 className="text-sm font-bold text-[#1D1F23] mb-3 uppercase tracking-wider">About this lesson</h4>
                  <p className="text-[14px] text-[#374151] whitespace-pre-line leading-relaxed">{selectedLesson.content}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#595C61]">
              <p>Select a lesson to begin</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}