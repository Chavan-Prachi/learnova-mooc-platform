import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Monitor, Code, Database, Palette, BarChart3, Heart } from 'lucide-react';
import './Home.css';
import vislyImage from "../assets/visily-image.png";
import student1 from "../assets/student1.webp";
import student2 from "../assets/student2.webp";
import student3 from "../assets/student3.webp";
import student4 from "../assets/student4.png";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <section className="max-w-[1440px] mx-auto px-12 py-20 grid grid-cols-2 gap-16 items-center">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Tag: START LEARNING TODAY */}
          <div className="w-fit">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold text-[#4338CA] bg-[#4338CA]/5 border border-[#4338CA]/20 uppercase tracking-wider">
              Start Learning Today
            </span>
          </div>

          {/* Heading: Learn Without Limits */}
          <h1 className="text-[56px] leading-[64px] font-extrabold text-[#1D1F23] font-jakarta">
            Learn Without Limits
          </h1>

          {/* Description */}
          <p className="text-[16px] leading-[24px] text-[#595C61] max-w-[518px]">
            Earn certificates and degrees from world-class universities and top
            companies. Build your career with flexible, professional online courses.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-2">
            {/* Explore Courses Button */}
            <Link
              to="/courses"
              className="w-[191px] h-12 flex items-center justify-center text-[16px] font-semibold text-[#F6F7F9] bg-[#461EA4] rounded-[12px] hover:bg-[#3a188a] transition-colors"
            >
              Explore Courses
            </Link>

            {/* View Plans Button */}
            <button className="w-[150px] h-12 flex items-center justify-center text-[16px] font-semibold text-[#1D1F23] bg-[#F6F7F9] border border-[#DFE1E4] rounded-[12px] hover:bg-gray-200 transition-colors">
              View Plans
            </button>
          </div>

          {/* Social Proof (Avatars + Text) */}
          <div className="flex items-center gap-4 mt-4 pt-6 border-t border-[#DFE1E4]">
            <div className="flex -space-x-3">
              {/* Placeholder Avatars - replace src with your actual images later */}
              {[
                student1,
                student2,
                student3,
                student4
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Student"
                  className="w-9 h-9 rounded-full border-2 border-[#F6F7F9] object-cover"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#1D1F23]">50k+ Happy Students</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#D97708] text-[#D97708]" />
                <span className="text-[12px] font-medium text-[#595C61]">4.9/5 Rating on Trustpilot</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Illustration) */}
        <div>
          <div className="image-wrapper">
            <div className="image-rectangle"></div>
            <div className="image-container"><img src={vislyImage} alt="Illustration" className="illustration" /></div>
          </div>
        </div>

        {/* TRUSTED BANNER - Full Width */}
      <div className="max-w-[1440px] mx-auto px-12 pb-20">
        <section className="trusted-banner">
          <h3 className="trusted-text">
            Trusted by 1,000+ Leading Universities and Companies
          </h3>

          <div className="icon-row">
            {[Monitor, Code, Database, Palette, BarChart3, Heart].map((Icon, index) => (
              <div key={index} className="icon-circle">
                <Icon />
              </div>
            ))}
          </div>
        </section>
        </div>
        </section>
    </div>
  );
}