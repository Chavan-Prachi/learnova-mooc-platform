import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#5533CC] flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="white"/>
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white"/>
                </svg>
              </div>
              <span className="text-[16px] font-bold text-[#111827]">Learnova</span>
            </Link>
            <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4 max-w-[180px]">
              Empowering learners worldwide through world-class certification and skill-building courses.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {["facebook","twitter","instagram","linkedin"].map((s) => (
                <a key={s} href="#" className="text-[#9CA3AF] hover:text-[#5533CC] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {s === "facebook" && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>}
                    {s === "twitter" && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>}
                    {s === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="white"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/></>}
                    {s === "linkedin" && <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us","Careers","Partners","Press"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-[#6B7280] hover:text-[#5533CC] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {["Blog","Support","Documentation","Community"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-[#6B7280] hover:text-[#5533CC] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Terms of Service","Privacy Policy","Cookie Policy","Accessibility"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-[#6B7280] hover:text-[#5533CC] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#111827] uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5">
              {["Help Center","Partnerships","Feedback"].map(l => (
                <li key={l}><a href="#" className="text-[13px] text-[#6B7280] hover:text-[#5533CC] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#111827]">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-[#9CA3AF]">© 2026 Learnova Inc. All rights reserved.</span>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              support@learnova.edu
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +1 (555) 123-4567
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              San Francisco, CA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}