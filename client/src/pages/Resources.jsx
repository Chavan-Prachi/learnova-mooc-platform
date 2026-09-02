import { Link } from "react-router-dom";

const RESOURCE_TYPES = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    iconBg: "#461EA4",
    count: "124 Resources",
    title: "PPT Presentations",
    desc: "Visual lecture slides, charts, and diagrams used during classroom",
    tags: ["SLIDES", "VISUALS", "CHARTS"],
    img: "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?w=400&h=200&fit=crop&auto=format",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    iconBg: "#EA580C",
    count: "86 Resources",
    title: "Video Lectures",
    desc: "High-definition recordings of live sessions and exclusive",
    tags: ["RECORDED", "4K HD", "MODULES"],
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop&auto=format",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
    iconBg: "#7C3AED",
    count: "42 Resources",
    title: "Ebooks & PDFs",
    desc: "Comprehensive textbooks, digital journals, and detailed research",
    tags: ["DIGITAL", "READING", "LIBRARY"],
    img: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=400&h=200&fit=crop&auto=format",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
    iconBg: "#6B7280",
    count: "215 Resources",
    title: "Revision Notes",
    desc: "Summarized key takeaways, flashcards, and exam preparation",
    tags: ["SUMMARY", "EXAMS", "STUDY"],
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=200&fit=crop&auto=format",
  },
];

const QUICK_TOOLS = [
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
    title: "Student Handbook",
    desc: "Official guidelines & code of conduct",
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
    title: "Curriculum Roadmap",
    desc: "Visual guide to your degree progress",
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
    title: "Research Portal",
    desc: "Access to IEEE, JSTOR & more",
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-4">
          <Link to="/" className="hover:text-[#461EA4] transition-colors">Home</Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
          <span className="text-[#595C61] font-medium">Resources Hub</span>
        </nav>

        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center border border-[#595C61]/30 rounded-full px-3 py-1 mb-3">
              <span className="text-[10px] font-semibold text-[#595C61] uppercase tracking-wider">Learner Support</span>
            </div>
            <h1 className="text-[30px] font-bold text-[#1D1F23] mb-2">Course Resources Hub</h1>
            <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[460px]">
              Access a comprehensive library of educational materials designed to support your learning journey. From interactive presentations to deep-dive ebooks.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search resources..."
                className="h-[38px] pl-9 pr-4 w-[220px] rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#595C61] placeholder-[#9CA3AF] focus:outline-none focus:border-[#461EA4] transition-all"
              />
            </div>
            <button type="button" className="h-[38px] px-4 border border-[#E5E7EB] bg-white rounded-lg text-[13px] text-[#595C61] hover:border-[#461EA4] hover:text-[#461EA4] flex items-center gap-2 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Bulk Download
            </button>
          </div>
        </div>

        {/* Core Learning Quadrants */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#461EA4] rounded-full"/>
            <h2 className="text-[18px] font-bold text-[#1D1F23]">Core Learning Quadrants</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESOURCE_TYPES.map((r) => (
              <div key={r.title} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-[140px] object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: r.iconBg}}>
                    {r.icon}
                  </div>
                  <div className="absolute bottom-2 left-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-md">
                    {r.count}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[14px] font-semibold text-[#1D1F23]">{r.title}</h3>
                    <svg className="text-[#9CA3AF] group-hover:text-[#461EA4] transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-snug mb-3">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-[#6B7280] border border-[#E5E7EB] rounded-full px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools + Featured Resource */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Quick Tools */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#595C61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <h3 className="text-[16px] font-bold text-[#1D1F23]">Quick Tools</h3>
            </div>
            <div className="space-y-1">
              {QUICK_TOOLS.map((tool) => (
                <button key={tool.title} type="button" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-[#F6F7F9] transition-colors group text-left">
                  <div className="text-[#6B7280] group-hover:text-[#461EA4] transition-colors shrink-0">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1D1F23] group-hover:text-[#461EA4] transition-colors">{tool.title}</p>
                    <p className="text-[12px] text-[#9CA3AF]">{tool.desc}</p>
                  </div>
                  <svg className="text-[#9CA3AF] group-hover:text-[#461EA4] transition-colors shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Resource */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex h-full">
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-[#F97316]/10 text-[#F97316] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                    New Resource
                  </div>
                  <h3 className="text-[18px] font-bold text-[#1D1F23] mb-3 leading-tight">
                    The 2024 AI Strategy Workbook
                  </h3>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed mb-5">
                    Our latest comprehensive guide on implementing artificial intelligence in modern business workflows. Includes 15+ case studies and interactive checklists.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" className="h-[36px] px-4 bg-[#F97316] hover:bg-[#EA580C] text-white text-[12px] font-semibold rounded-lg transition-all">
                    Download Now
                  </button>
                  <button type="button" className="h-[36px] px-4 border border-[#E5E7EB] text-[#595C61] hover:border-[#461EA4] hover:text-[#461EA4] text-[12px] font-semibold rounded-lg transition-all">
                    Details
                  </button>
                </div>
              </div>
              <div className="w-[180px] shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1737644467636-6b0053476bb2?w=240&h=240&fit=crop&auto=format"
                  alt="AI Strategy Workbook"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Can't find resource CTA */}
        <div className="bg-[#1C1C2E] rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-[26px] font-bold text-white mb-3 leading-tight">
                Can't find a specific resource?
              </h2>
              <p className="text-[14px] text-white/60 leading-relaxed mb-6">
                Our support team and library assistants are available 24/7 to help you track down specific lecture recordings, textbook editions, or study guides.
              </p>
              <div className="flex items-center gap-3">
                <button type="button" className="h-[40px] px-5 bg-[#F97316] hover:bg-[#EA580C] text-white text-[13px] font-semibold rounded-full transition-all">
                  Request Material
                </button>
                <button type="button" className="h-[40px] px-5 border border-white/20 text-white hover:border-white/50 text-[13px] font-semibold rounded-full transition-all">
                  Contact Support
                </button>
              </div>
            </div>
            <div className="bg-[#25253A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]"/>
                <span className="text-[13px] font-semibold text-white">Support Experts Online</span>
              </div>
              {[
                "Response time: < 15 mins",
                "Database access: Full Coverage",
                "Support priority: Tier 1 Student",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-[#1C1C2E] rounded-lg px-4 py-3 mb-2 last:mb-0">
                  <svg className="text-[#9CA3AF] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                  <span className="text-[12px] text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}