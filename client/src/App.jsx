import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import InstructorCourseManager from "./pages/InstructorCourseManager";
import FloatingChatbot from "./components/FloatingChatbot";
// Pages
import HomePage from "./pages/HomePage";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Resources from "./pages/Resources";
import ResourceCategory from "./pages/ResourceCategory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/InstructorDashboard";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse"; // <-- 1. ADDED THIS IMPORT
import TestEnrollment from "./pages/TestEnrollment";

function PageWrapper({ children, title }) {
  useEffect(() => {
    document.title = title ? `${title} - Learnova` : "Learnova - Learn Without Limits";
  }, [title]);

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PageWrapper title="Home"><HomePage /></PageWrapper>} />
      <Route path="/courses" element={<PageWrapper title="Data Science Courses"><Courses /></PageWrapper>} />
      <Route path="/course/:id" element={<PageWrapper title="Course Details"><CourseDetail /></PageWrapper>} />
      
      {/* 2. ADDED THIS ROUTE FOR THE STUDENT LEARNING PLAYER */}
      <Route path="/learn/:id" element={<PageWrapper title="Learning"><LearnCourse /></PageWrapper>} />   
      <Route path="/resources" element={<PageWrapper title="Resources"><Resources /></PageWrapper>} />
      <Route path="/resources/:type" element={<PageWrapper title="Resource Category"><ResourceCategory /></PageWrapper>} />
      <Route path="/login" element={<PageWrapper title="Login"><Login /></PageWrapper>} />
      <Route path="/register" element={<PageWrapper title="Register"><Register /></PageWrapper>} />
      <Route path="/instructor" element={<PageWrapper title="Instructor Dashboard"><InstructorDashboard /></PageWrapper>} />
      <Route path="/my-courses" element={<PageWrapper title="My Learning"><MyCourses /></PageWrapper>} />
      <Route path="/test-enrollment" element={<TestEnrollment />} />
      <Route path="/instructor/course/:courseId" element={<InstructorCourseManager />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F6F7F9] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
          <FloatingChatbot />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;