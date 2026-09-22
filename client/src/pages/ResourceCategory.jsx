import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Presentation, 
  Video, 
  BookOpen, 
  Search,
  ExternalLink,
  Calendar
} from "lucide-react";

const RESOURCE_CONFIG = {
  ppt: {
    title: "PPT Presentations",
    icon: <Presentation className="w-5 h-5" />,
    color: "#461EA4",
    bgColor: "bg-[#461EA4]/10",
    description: "Visual lecture slides, charts, and diagrams used during classroom sessions."
  },
  video: {
    title: "Video Lectures",
    icon: <Video className="w-5 h-5" />,
    color: "#EA580C",
    bgColor: "bg-[#EA580C]/10",
    description: "High-definition recordings of live sessions and exclusive masterclasses."
  },
  ebook: {
    title: "Ebooks & PDFs",
    icon: <BookOpen className="w-5 h-5" />,
    color: "#7C3AED",
    bgColor: "bg-[#7C3AED]/10",
    description: "Comprehensive textbooks, digital journals, and detailed research papers."
  },
  notes: {
    title: "Revision Notes",
    icon: <FileText className="w-5 h-5" />,
    color: "#6B7280",
    bgColor: "bg-[#6B7280]/10",
    description: "Summarized key takeaways, flashcards, and exam preparation materials."
  }
};

export default function ResourceCategory() {
  const { type } = useParams();
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [bulkDownloading, setBulkDownloading] = useState(false);

  const config = RESOURCE_CONFIG[type] || RESOURCE_CONFIG.ppt;

  useEffect(() => {
    fetchResources();
  }, [type]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      const enrollRes = await API.get('/api/enrollments/my-courses');
      const enrolled = enrollRes.data;
      setEnrolledCourses(enrolled);

      const allResources = [];
      
      for (const enrollment of enrolled) {
        const courseId = enrollment.course?._id || enrollment.course;
        
        if (!courseId) continue;

        try {
          const courseRes = await API.get(`/api/courses/${courseId}`);
          const course = courseRes.data;

          if (!course.lessons || course.lessons.length === 0) continue;

          course.lessons.forEach(lesson => {
            let resourceUrl = null;

            if (type === 'ppt' && lesson.type === 'ppt' && lesson.fileUrl) {
              resourceUrl = lesson.fileUrl;
            } else if (type === 'video' && lesson.type === 'video' && lesson.videoUrl) {
              resourceUrl = lesson.videoUrl;
            } else if (type === 'ebook' && lesson.type === 'ebook' && lesson.fileUrl) {
              resourceUrl = lesson.fileUrl;
            } else if (type === 'notes' && lesson.type === 'notes' && lesson.fileUrl) {
              resourceUrl = lesson.fileUrl;
            }

            if (resourceUrl) {
              allResources.push({
                _id: lesson._id,
                title: lesson.title,
                url: resourceUrl,
                type: lesson.type,
                course: course.title,
                courseId: course._id,
                module: lesson.module || "General",
                createdAt: lesson.createdAt || enrollment.enrolledAt
              });
            }
          });
        } catch (err) {
          console.error(`Failed to fetch course ${courseId}:`, err);
        }
      }

      setResources(allResources);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    try {
      let downloadUrl = resource.url;
      
      if (resource.url.includes('drive.google.com')) {
        const fileIdMatch = resource.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      
      const extension = resource.type === 'video' ? 'mp4' : 
                       resource.type === 'ppt' ? 'pptx' : 'pdf';
      link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Download failed:", error);
      window.open(resource.url, '_blank');
    }
  };

  const handleBulkDownload = async () => {
    setBulkDownloading(true);
    
    try {
      const resourcesToDownload = filteredResources;
      
      for (let i = 0; i < resourcesToDownload.length; i++) {
        const resource = resourcesToDownload[i];
        await handleDownload(resource);
        
        // Add delay between downloads to avoid browser blocking
        if (i < resourcesToDownload.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      alert(`Successfully initiated download of ${resourcesToDownload.length} resources!`);
    } catch (error) {
      console.error("Bulk download failed:", error);
      alert("Bulk download failed. Please try downloading files individually.");
    } finally {
      setBulkDownloading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "all" || resource.courseId === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#461EA4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/resources" 
            className="inline-flex items-center gap-2 text-[#595C61] hover:text-[#461EA4] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Resources Hub</span>
          </Link>
          
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className={`inline-flex items-center gap-2 ${config.bgColor} rounded-full px-3 py-1 mb-3`}>
                <span style={{ color: config.color }}>{config.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                  {resources.length} Resources Found
                </span>
              </div>
              <h1 className="text-[32px] font-bold text-[#1D1F23] mb-2">{config.title}</h1>
              <p className="text-[15px] text-[#595C61]">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#DFE1E4] p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 rounded-lg border border-[#DFE1E4] bg-[#F6F7F9] text-[14px] focus:outline-none focus:border-[#461EA4] transition-all"
            />
          </div>
          
          {enrolledCourses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="h-[42px] px-4 rounded-lg border border-[#DFE1E4] bg-[#F6F7F9] text-[14px] focus:outline-none focus:border-[#461EA4] min-w-[200px] cursor-pointer"
            >
              <option value="all">All Courses ({enrolledCourses.length})</option>
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.course;
                const courseId = course?._id || course;
                const courseTitle = course?.title || 'Unknown Course';
                
                return (
                  <option key={courseId} value={courseId}>
                    {courseTitle}
                  </option>
                );
              })}
            </select>
          )}
          
          {filteredResources.length > 0 && (
            <button
              onClick={handleBulkDownload}
              disabled={bulkDownloading}
              className="h-[42px] px-5 bg-[#461EA4] hover:bg-[#3a188a] disabled:bg-gray-400 text-white text-[14px] font-medium rounded-lg flex items-center gap-2 transition-all shadow-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              {bulkDownloading ? 'Downloading...' : `Bulk Download (${filteredResources.length})`}
            </button>
          )}
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DFE1E4] p-16 text-center">
            <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span style={{ color: config.color }}>{config.icon}</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#1D1F23] mb-2">No resources found</h3>
            <p className="text-[#595C61] mb-6">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : selectedCourse !== "all"
                ? "No resources found for this course"
                : "You don't have any resources of this type yet"}
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#461EA4] text-white rounded-lg font-semibold hover:bg-[#3a188a] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource._id} 
                className="bg-white rounded-xl border border-[#DFE1E4] p-5 hover:shadow-lg hover:border-[#461EA4]/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                    <span style={{ color: config.color }}>{config.icon}</span>
                  </div>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="p-2 text-[#595C61] hover:text-[#461EA4] hover:bg-[#461EA4]/5 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-[16px] font-bold text-[#1D1F23] mb-2 line-clamp-2 group-hover:text-[#461EA4] transition-colors">
                  {resource.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[12px] text-[#595C61]">
                    <BookOpen className="w-3 h-3" />
                    <span className="truncate">{resource.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#595C61]">
                    <Calendar className="w-3 h-3" />
                    <span>{resource.module}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-[#DFE1E4]">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex-1 h-[36px] bg-[#461EA4] hover:bg-[#3a188a] text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[36px] px-3 border border-[#DFE1E4] hover:border-[#461EA4] hover:text-[#461EA4] rounded-lg transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}