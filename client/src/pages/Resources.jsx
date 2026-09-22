import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { 
  Presentation, 
  Video, 
  BookOpen, 
  FileText, 
  ChevronRight,
  MessageSquare,
  Mail,
  Phone,
  HelpCircle
} from "lucide-react";

const RESOURCE_TYPES = [
  {
    type: 'ppt',
    icon: <Presentation className="w-5 h-5 text-white" />,
    iconBg: "#461EA4",
    title: "PPT Presentations",
    desc: "Visual lecture slides, charts, and diagrams used during classroom sessions.",
    tags: ["SLIDES", "VISUALS", "CHARTS"],
    img: "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?w=400&h=200&fit=crop&auto=format",
  },
  {
    type: 'video',
    icon: <Video className="w-5 h-5 text-white" />,
    iconBg: "#EA580C",
    title: "Video Lectures",
    desc: "High-definition recordings of live sessions and exclusive masterclasses.",
    tags: ["RECORDED", "4K HD", "MODULES"],
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop&auto=format",
  },
  {
    type: 'ebook',
    icon: <BookOpen className="w-5 h-5 text-white" />,
    iconBg: "#7C3AED",
    title: "Ebooks & PDFs",
    desc: "Comprehensive textbooks, digital journals, and detailed research papers.",
    tags: ["DIGITAL", "READING", "LIBRARY"],
    img: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=400&h=200&fit=crop&auto=format",
  },
  {
    type: 'notes',
    icon: <FileText className="w-5 h-5 text-white" />,
    iconBg: "#6B7280",
    title: "Revision Notes",
    desc: "Summarized key takeaways, flashcards, and exam preparation materials.",
    tags: ["SUMMARY", "EXAMS", "STUDY"],
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=200&fit=crop&auto=format",
  },
];

export default function Resources() {
  const { user } = useContext(AuthContext);
  const [resourceCounts, setResourceCounts] = useState({
    ppt: 0,
    video: 0,
    ebook: 0,
    notes: 0
  });

  useEffect(() => {
    fetchResourceCounts();
  }, []);

  const fetchResourceCounts = async () => {
    try {
      const enrollRes = await API.get('/api/enrollments/my-courses');
      const enrolled = enrollRes.data;
      
      const counts = { ppt: 0, video: 0, ebook: 0, notes: 0 };
      
      for (const enrollment of enrolled) {
        const courseId = enrollment.course?._id || enrollment.course;
        if (!courseId) continue;

        try {
          const courseRes = await API.get(`/api/courses/${courseId}`);
          const course = courseRes.data;

          if (!course.lessons) continue;

          course.lessons.forEach(lesson => {
            if (lesson.type === 'ppt' && lesson.fileUrl) counts.ppt++;
            else if (lesson.type === 'video' && lesson.videoUrl) counts.video++;
            else if (lesson.type === 'ebook' && lesson.fileUrl) counts.ebook++;
            else if (lesson.type === 'notes' && lesson.fileUrl) counts.notes++;
          });
        } catch (err) {
          console.error(`Failed to fetch course ${courseId}:`, err);
        }
      }
      
      setResourceCounts(counts);
    } catch (error) {
      console.error("Failed to fetch resource counts:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#461EA4] transition-colors flex items-center gap-1">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1D1F23] font-semibold">Resources Hub</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center border border-[#461EA4]/30 bg-[#461EA4]/5 rounded-full px-3 py-1 mb-4">
            <span className="text-[10px] font-bold text-[#461EA4] uppercase tracking-wider">Learner Support</span>
          </div>
          <h1 className="text-[36px] font-bold text-[#1D1F23] mb-3">Course Resources Hub</h1>
          <p className="text-[16px] text-[#595C61] leading-relaxed max-w-[600px]">
            Access a comprehensive library of educational materials designed to support your learning journey. From interactive presentations to deep-dive ebooks.
          </p>
        </div>

        {/* Core Learning Quadrants */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#461EA4] rounded-full"/>
            <h2 className="text-[22px] font-bold text-[#1D1F23]">Core Learning Quadrants</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESOURCE_TYPES.map((r) => {
              const count = resourceCounts[r.type] || 0;
              
              return (
                <Link 
                  key={r.title} 
                  to={`/resources/${r.type}`}
                  className="bg-white rounded-2xl border border-[#DFE1E4] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer block"
                >
                  <div className="relative overflow-hidden h-[160px]">
                    <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div 
                      className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" 
                      style={{backgroundColor: r.iconBg}}
                    >
                      {r.icon}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg">
                      {count} {count === 1 ? 'Resource' : 'Resources'}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[16px] font-bold text-[#1D1F23]">{r.title}</h3>
                      <ChevronRight className="text-[#9CA3AF] group-hover:text-[#461EA4] group-hover:translate-x-1 transition-all w-4 h-4" />
                    </div>
                    <p className="text-[13px] text-[#595C61] leading-snug mb-4 line-clamp-2">{r.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {r.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-[#595C61] bg-[#F6F7F9] border border-[#DFE1E4] rounded-md px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Need Help Section - END OF PAGE */}
        <div className="bg-gradient-to-br from-[#461EA4]/5 to-[#5533CC]/5 rounded-3xl border border-[#461EA4]/20 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-6 h-6 text-[#461EA4]" />
                <h3 className="text-[24px] font-bold text-[#1D1F23]">Need Help Finding Resources?</h3>
              </div>
              <p className="text-[#595C61] mb-6 leading-relaxed">
                Can't find what you're looking for? Our support team is here to help you access the right materials for your courses.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE1E4]">
                  <div className="w-10 h-10 rounded-lg bg-[#461EA4]/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#461EA4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D1F23] mb-1">Live Chat Support</h4>
                    <p className="text-sm text-[#595C61]">Chat with our team Mon-Fri, 9am-6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE1E4]">
                  <div className="w-10 h-10 rounded-lg bg-[#461EA4]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#461EA4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D1F23] mb-1">Email Us</h4>
                    <p className="text-sm text-[#595C61]">support@learnova.com</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE1E4]">
                  <div className="w-10 h-10 rounded-lg bg-[#461EA4]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#461EA4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D1F23] mb-1">Call Us</h4>
                    <p className="text-sm text-[#595C61]">+1 (555) 123-4567</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Available during business hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="hidden md:flex items-center justify-center">
              <svg viewBox="0 0 400 350" className="w-full max-w-md">
                {/* Background circles */}
                <circle cx="300" cy="80" r="80" fill="rgba(70,30,164,0.05)" />
                <circle cx="100" cy="250" r="60" fill="rgba(70,30,164,0.05)" />
                
                {/* Chat bubble */}
                <rect x="80" y="100" width="140" height="100" rx="12" fill="white" stroke="#461EA4" strokeWidth="2" />
                <polygon points="80,140 70,130 90,140" fill="white" stroke="#461EA4" strokeWidth="2" />
                <rect x="95" y="115" width="80" height="8" rx="4" fill="#461EA4" />
                <rect x="95" y="130" width="100" height="6" rx="3" fill="#461EA4" opacity="0.3" />
                <rect x="95" y="142" width="90" height="6" rx="3" fill="#461EA4" opacity="0.3" />
                <rect x="95" y="154" width="70" height="6" rx="3" fill="#461EA4" opacity="0.3" />
                
                {/* Support person */}
                <circle cx="280" cy="180" r="50" fill="white" stroke="#461EA4" strokeWidth="2" />
                <circle cx="280" cy="160" r="20" fill="#461EA4" opacity="0.2" />
                <circle cx="280" cy="160" r="15" fill="#461EA4" />
                <path d="M 260 200 Q 280 220 300 200" stroke="#461EA4" strokeWidth="3" fill="none" />
                
                {/* Headset */}
                <path d="M 265 155 Q 280 145 295 155" stroke="#EA580C" strokeWidth="3" fill="none" />
                <rect x="260" y="155" width="8" height="15" rx="3" fill="#EA580C" />
                <rect x="292" y="155" width="8" height="15" rx="3" fill="#EA580C" />
                
                {/* Message icon */}
                <circle cx="320" cy="120" r="35" fill="#EA580C" />
                <path d="M 305 115 Q 320 125 335 115" stroke="white" strokeWidth="2.5" fill="none" />
                <path d="M 305 125 Q 320 135 335 125" stroke="white" strokeWidth="2.5" fill="none" />
                
                {/* Connection lines */}
                <path d="M 220 150 Q 240 140 260 155" stroke="#461EA4" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}