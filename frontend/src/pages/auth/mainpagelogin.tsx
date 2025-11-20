// src/pages/auth/MainLoginPage.tsx
import Header from "../../components/Header.tsx";

const MainLoginPage = () => {

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-6 px-4
     overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 via-white to-blue-50 border-2 border-maincolor-300 rounded-lg">

        {/* LEFT SECTION */}
        <div className="md:w-1/1 bg-maincolor text-white flex flex-col justify-center p-12 relative overflow-hidden">

          {/* Background Design */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white,transparent)]"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold  mb-5 leading-tight">
              Spectropy<br /> E-Learning Platform
            </h1>

            <p className="text-lg opacity-95 mb-8 leading-relaxed">
              A modern digital learning ecosystem built to empower institutions, educators,
              and learners with seamless and interactive education tools.
            </p>

            <div className="space-y-3 text-base font-medium">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span> AI-Driven Smart Learning Path
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span> Advanced Student Analytics & Progress Tracking
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span> Adaptive Assessments & Interactive LMS
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span> Digital Classroom, Notes & Resources Library
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span> Smooth, Secure and Scalable for Institutions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Spectropy. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLoginPage;