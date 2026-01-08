import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "/spectropy_logo.png";
import EventsPage from './Eventspage';
import BlogPage from './BlogPage';
import FutureFoundationSlider from './FutureFoundationSlider';
import HappyClientsSlider from './HappyClientsSlider';
import Programff from './futurefoundation';
// --- SVGs for Icons ---
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const ArrowRightIcon = () => (
  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
const PhoneIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const LocationIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ChartIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);
const BookIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const ChipIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
);
const UserGroupIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

// Program Icons
const FutureIcon = () => <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const CatalystIcon = () => <svg className="w-12 h-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const MaestroIcon = () => <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PioneerIcon = () => <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      if (showLoginOptions) setShowLoginOptions(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showLoginOptions]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

    // Happy clients slider is rendered directly below the Programs section.

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* --- MODALS (Overlays) --- */}
      {activeModal && (
        <div className={`fixed inset-0 z-[60] flex w-full h-full bg-white`}>
          <div className={`w-full h-full relative`}>
            {activeModal !== 'events' && (
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <CloseIcon />
              </button>
            )}
            
            <div className="p-8 md:p-12 h-full overflow-y-auto">
              {activeModal === 'events' && (
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10"
                >
                  <CloseIcon />
                </button>
              )}

              {/* Content for Core Challenges Modal */}
              
              {/* Content for Core Challenges Modal (FULL SCREEN VERTICAL FLOW) */}
              {activeModal === 'challenges' && (
                <div className="w-full max-w-5xl h-full mx-auto">
                  
                  {/* Header Section */}
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                      THE CORE CHALLENGES IN<br />
                      <span className="text-blue-600">TODAY'S SCHOOL LEARNING</span>
                    </h2>
                    <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                        The Gap Between Traditional Schooling and Competitive Success
                    </p>
                  </div>

                  {/* Vertical Flow Container */}
                  <div className="space-y-6 relative max-w-4xl mx-auto">
                    
                    {/* Vertical Connecting Line (Background) */}
                    <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-slate-200 -translate-x-1/2 z-0 hidden md:block"></div>

                    {/* 1. Curriculum (Blue) */}
                    <div className="relative z-10 bg-white border-l-8 border-blue-500 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute -top-4 left-6 md:left-1/2 md:-translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                            1. Curriculum is Theoretical
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl shrink-0 border-2 border-blue-100">
                                📚
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    Students lack <span className="font-bold text-blue-900 bg-blue-50 px-1 rounded">application-based learning</span> which is essential for IIT, Olympiads, and competitive exams. Focus is on rote memorization over practical problem-solving.
                                </p>
                            </div>
                            <div className="hidden md:block text-blue-200">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex justify-center relative z-10 text-slate-300 py-2"><svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>

                    {/* 2. Conceptual Gaps (Orange) */}
                    <div className="relative z-10 bg-white border-l-8 border-orange-500 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute -top-4 left-6 md:left-1/2 md:-translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                            2. Conceptual Gaps Increase
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl shrink-0 border-2 border-orange-100">
                                📉
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    Weak basics in lower grades lead to <span className="font-bold text-orange-900 bg-orange-50 px-1 rounded">exponential struggle</span> in higher classes. Fundamental misunderstanding compounds from Grades 6-8 to 9-10.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex justify-center relative z-10 text-slate-300 py-2"><svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>

                    {/* 3. Teacher Shortage (Purple) */}
                    <div className="relative z-10 bg-white border-l-8 border-purple-500 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute -top-4 left-6 md:left-1/2 md:-translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                            3. Teacher Shortage in STEM
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
                            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-4xl shrink-0 border-2 border-purple-100">
                                👨‍🏫
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    Schools often lack specialized faculty for higher-level problem-solving and <span className="font-bold text-purple-900 bg-purple-50 px-1 rounded">advanced STEM concepts</span> required for competitive levels.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex justify-center relative z-10 text-slate-300 py-2"><svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>

                    {/* 4. Parent Expectations (Green) */}
                    <div className="relative z-10 bg-white border-l-8 border-green-500 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute -top-4 left-6 md:left-1/2 md:-translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                            4. Parent Expectations
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl shrink-0 border-2 border-green-100">
                                👪
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    Parents want IIT/NEET/Engineering foundation programs <span className="font-bold text-green-900 bg-green-50 px-1 rounded">integrated directly</span> into the school curriculum, seeking a one-stop solution.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Arrow Down */}
                    <div className="flex justify-center relative z-10 text-slate-300 py-2"><svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>

                    {/* 5. No Diagnostic (Red) */}
                    <div className="relative z-10 bg-white border-l-8 border-red-500 rounded-xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute -top-4 left-6 md:left-1/2 md:-translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                            5. No Diagnostic Tracking
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl shrink-0 border-2 border-red-100">
                                🚫
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    Schools do not receive accurate analytics for identifying specific student weaknesses, leading to ineffective remedial actions and <span className="font-bold text-red-900 bg-red-50 px-1 rounded">"flying blind"</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                  </div>
                </div>
              )}

              
              {/* Content for Solutions Modal */}
              {activeModal === 'solution' && (
                <div className="w-full max-w-6xl mx-auto relative">
                   {/* Watermark Background Container */}
                   <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
                        {/* Placeholder for Image 2 (Vision Campus) as Watermark */}
                        <svg className="w-[120%] h-auto text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                   </div>

                   <div className="relative z-10">
                       <div className="text-center mb-10">
                           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">THE SPECTROPY IIT Foundation & STEM SOLUTION </h2>
                           <p className="text-lg text-slate-600 font-medium">Seamless Integration.Measurable Results. </p>
                       </div>
                       
                       {/* Grid Layout matching the Image Structure */}
                       <div className="grid md:grid-cols-2 gap-8 mb-8">
                            
                            {/* 1. CORE ACADEMIC ARCHITECTURE (Blue) */}
                            <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                                <h3 className="bg-blue-600 text-white text-lg font-bold py-2 px-6 rounded-full self-start mb-6 shadow-md">1.CORE ACADEMIC ARCHITECTURE</h3>
                                
                                <div className="flex flex-col md:flex-row items-center gap-6 flex-grow justify-center">
                                    {/* Curriculum */}
                                    <div className="text-center flex-1">
                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto border border-blue-100">📚</div>
                                        <h4 className="font-bold text-blue-900 text-sm mb-1">IIT Foundation Curriculum </h4>
                                        <p className="text-xs text-slate-600">(Grades 6-10): Math, Physics, Chemistry, Biology </p>
                                    </div>
                                    
                                    {/* Divider */}
                                    <div className="w-px h-24 bg-blue-100 hidden md:block"></div>
                                    
                                    {/* Olympiad */}
                                    <div className="text-center flex-1">
                                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto border border-yellow-100">🏆</div>
                                        <h4 className="font-bold text-blue-900 text-sm mb-1">Olympiad Training </h4>
                                        <p className="text-xs text-slate-600">NSO, IMO, NTSE, NSEJS, IAPT </p>
                                    </div>
                                </div>
                                {/* Watermark Effect on Hover */}
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            </div>

                            {/* 2. SKILL DEVELOPMENT ECOSYSTEM (Green) */}
                            <div className="bg-white border-2 border-green-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-green-600"></div>
                                <h3 className="bg-green-600 text-white text-lg font-bold py-2 px-6 rounded-full self-start mb-6 shadow-md">2.SKILL DEVELOPMENT ECOSYSTEM</h3>
                                
                                <div className="flex flex-col items-center justify-center flex-grow py-4">
                                    <div className="w-16 h-16 text-4xl mb-4 animate-pulse">🧠</div>
                                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full">
                                        <div className="border-2 border-green-500 rounded-full w-24 h-24 flex items-center justify-center text-center p-2 text-xs font-bold text-green-800 shadow-sm bg-green-50">
                                            Problem-<br/>solving 
                                        </div>
                                        <div className="self-center text-green-300 text-xl font-bold">→</div>
                                        <div className="border-2 border-green-500 rounded-full w-24 h-24 flex items-center justify-center text-center p-2 text-xs font-bold text-green-800 shadow-sm bg-green-50">
                                            Critical<br/>thinking 
                                        </div>
                                        <div className="self-center text-green-300 text-xl font-bold">→</div>
                                        <div className="border-2 border-green-500 rounded-full w-24 h-24 flex items-center justify-center text-center p-2 text-xs font-bold text-green-800 shadow-sm bg-green-50">
                                            Analytical<br/>reasoning 
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            </div>
                       </div>

                       {/* 3. ADVANCED ACADEMIC TOOLS (Purple) - Full Width */}
                       <div className="bg-white border-2 border-purple-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group mb-8">
                            <div className="absolute top-0 left-0 w-full h-2 bg-purple-600"></div>
                            <h3 className="bg-purple-600 text-white text-lg font-bold py-2 px-6 rounded-full self-center md:self-start mb-10 shadow-md inline-block">3.ADVANCED ACADEMIC TOOLS (THE "TECH LAYER")</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                                {/* Tool 1 */}
                                <div className="flex flex-col items-center group/item">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-sm group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">📱</div>
                                    <p className="text-sm font-bold text-slate-700">Micro Learning<br/>Strategy </p>
                                </div>
                                {/* Tool 2 */}
                                <div className="flex flex-col items-center group/item">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-sm group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">💻</div>
                                    <p className="text-sm font-bold text-slate-700">Digital Teaching<br/>Content </p>
                                </div>
                                {/* Tool 3 */}
                                <div className="flex flex-col items-center group/item">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-sm group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">📝</div>
                                    <p className="text-sm font-bold text-slate-700">Online Exams<br/>(TAB EXAM) </p>
                                </div>
                                {/* Tool 4 */}
                                <div className="flex flex-col items-center group/item">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-sm group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">📊</div>
                                    <p className="text-sm font-bold text-slate-700">Results &<br/>Analytics </p>
                                </div>
                            </div>
                            
                            {/* Decorative Central Hub Lines (Visual only) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-px bg-purple-100 -z-0 hidden md:block"></div>
                       </div>

                       {/* 4. FULL SCHOOL SUPPORT SYSTEM (Orange) - Full Width */}
                       <div className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                            <h3 className="bg-orange-500 text-white text-lg font-bold py-2 px-6 rounded-full self-center md:self-start mb-8 shadow-md inline-block">4.FULL SCHOOL SUPPORT SYSTEM</h3>
                            
                            <div className="flex flex-wrap justify-around items-center gap-6 md:gap-0 relative">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center w-1/2 md:w-1/5 z-10">
                                    <div className="w-20 h-20 border-4 border-orange-400 rounded-full flex items-center justify-center bg-white shadow-md text-3xl mb-3">👪</div>
                                    <p className="font-bold text-slate-800 text-center text-sm">Parent<br/>Seminar </p>
                                </div>
                                {/* Arrow */}
                                <div className="hidden md:block text-orange-300 text-2xl">➜</div>
                                
                                {/* Step 2 */}
                                <div className="flex flex-col items-center w-1/2 md:w-1/5 z-10">
                                    <div className="w-20 h-20 border-4 border-orange-400 rounded-full flex items-center justify-center bg-white shadow-md text-3xl mb-3">👨‍🏫</div>
                                    <p className="font-bold text-slate-800 text-center text-sm">Teacher Training<br/>Workshops </p>
                                </div>
                                {/* Arrow */}
                                <div className="hidden md:block text-orange-300 text-2xl">➜</div>

                                {/* Step 3 */}
                                <div className="flex flex-col items-center w-1/2 md:w-1/5 z-10">
                                    <div className="w-20 h-20 border-4 border-orange-400 rounded-full flex items-center justify-center bg-white shadow-md text-3xl mb-3">🧠</div>
                                    <p className="font-bold text-slate-800 text-center text-sm">Subject Enrichment<br/>Sessions</p>
                                </div>
                                {/* Arrow */}
                                <div className="hidden md:block text-orange-300 text-2xl">➜</div>

                                {/* Step 4 */}
                                <div className="flex flex-col items-center w-1/2 md:w-1/5 z-10">
                                    <div className="w-20 h-20 border-4 border-orange-400 rounded-full flex items-center justify-center bg-white shadow-md text-3xl mb-3">📋</div>
                                    <p className="font-bold text-slate-800 text-center text-sm">Academic<br/>Auditions </p>
                                </div>
                            </div>
                       </div>
                       
                       <div className="mt-12 text-center">
                           <p className="text-xl font-bold text-indigo-900 italic">"Transforming Schools into Centers of Excellence."</p>
                       </div>
                   </div>
                </div>
              )}

              {/* Content for Programs Modal */}
              {/* --- 1. FUTURE FOUNDATION MODAL (Detailed View) --- */}
            {activeModal === 'program-future' && (
              <Programff />  
            )}
             
             
           {/* --- 2. CATALYST PROGRAM MODAL (Detailed View) --- */}
            {activeModal === 'program-catalyst' && (
              <div className="w-full max-w-6xl mx-auto pb-12">
                  {/* Header */}
                  <div className="text-center mb-10 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-teal-500 rounded-full"></div>
                      <div className="pt-6">
                          <div className="inline-block p-3 rounded-full bg-teal-50 mb-4 border border-teal-100">
                              <CatalystIcon />
                          </div>
                          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">CATALYST PROGRAM</h2>
                          <div className="inline-block bg-teal-700 text-white px-4 py-1 rounded-md text-sm md:text-lg font-bold shadow-md mb-2">
                              Bridge to Competitive Excellence for Advanced Learners
                          </div>
                          <p className="text-slate-600 font-medium italic">"80% Foundation + 20% Advanced: The Perfect Balance"</p>
                      </div>
                  </div>

                  <div className="space-y-8">
                      
                      {/* SECTION 1: ACADEMIC CORE (Curriculum & Targets) */}
                      <div className="bg-white border-t-4 border-teal-600 rounded-xl shadow-lg p-6 md:p-8 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
                          <h3 className="text-xl md:text-2xl font-bold text-teal-900 mb-6 flex items-center border-b pb-4">
                              <span className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg shadow-md">1</span>
                              ACADEMIC CORE (Curriculum & Targets)
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-8 items-center">
                              {/* Left: The 80/20 Split Visual */}
                              <div className="flex items-center justify-center p-6 bg-teal-50 rounded-xl border border-teal-100 relative">
                                  <div className="relative w-48 h-48 rounded-full bg-white border-8 border-slate-200 flex items-center justify-center shadow-inner">
                                      {/* CSS Pie Chart Representation */}
                                      <div className="absolute inset-0 rounded-full border-[20px] border-blue-600 border-r-orange-500 border-b-blue-600 border-l-blue-600 transform rotate-45 opacity-80"></div>
                                      <div className="z-10 text-center">
                                          <div className="text-2xl font-bold text-blue-700">80%</div>
                                          <div className="text-[10px] text-slate-500 font-bold">Foundation</div>
                                          <div className="w-full h-px bg-slate-300 my-1"></div>
                                          <div className="text-xl font-bold text-orange-600">20%</div>
                                          <div className="text-[10px] text-slate-500 font-bold">Advanced</div>
                                      </div>
                                  </div>
                                  
                                  {/* Labels */}
                                  <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded shadow text-xs font-bold text-blue-700 border border-blue-200">
                                      NCERT/SCERT 
                                  </div>
                                  <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded shadow text-xs font-bold text-orange-600 border border-orange-200">
                                      Bridge to Competitive 
                                  </div>
                              </div>

                              {/* Right: Targets & Suitability */}
                              <div className="space-y-6">
                                  <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm">
                                      <div className="flex items-center gap-3 mb-3">
                                          <div className="text-3xl">🎯</div>
                                          <h4 className="font-bold text-slate-800 text-lg">TARGET EXAMS</h4>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-bold">NEET</span>
                                          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-bold">EAPCET</span>
                                          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-bold">Olympiads </span>
                                      </div>
                                  </div>

                                  <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                                      <div className="text-3xl">👥</div>
                                      <div>
                                          <h5 className="font-bold text-orange-900 text-sm uppercase">Inclusivity</h5>
                                          <p className="text-xs text-orange-800 font-medium">Suitable for All Kinds of Students </p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 2: LEARNING ECOSYSTEM */}
                      <div className="bg-white border-t-4 border-orange-500 rounded-xl shadow-lg p-6 md:p-8 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
                          <h3 className="text-xl md:text-2xl font-bold text-orange-900 mb-6 flex items-center border-b pb-4">
                              <span className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg shadow-md">2</span>
                              LEARNING ECOSYSTEM (Materials, Digital & Support)
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                              {/* Material & Digital */}
                              <div className="space-y-4">
                                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                      <div className="text-4xl">📚</div>
                                      <div>
                                          <h5 className="font-bold text-slate-800">Learning Material</h5>
                                          <p className="text-xs text-slate-600">Concept Book & Workbook </p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="text-4xl">💻</div>
                                      <div>
                                          <h5 className="font-bold text-slate-800">DITP (Digital Product)</h5>
                                          <p className="text-xs text-slate-600">Digital Content, Teacher Login & Teach </p>
                                      </div>
                                  </div>
                              </div>

                              {/* Support System */}
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2 bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 shadow-sm">
                                      <span className="bg-blue-100 p-2 rounded text-blue-700 text-lg">👨‍🏫</span>
                                      <span className="text-xs font-bold text-slate-700">Teacher Training Workshop </span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 shadow-sm">
                                      <span className="bg-pink-100 p-2 rounded text-pink-700 text-lg">💡</span>
                                      <span className="text-xs font-bold text-slate-700">Enrichment Sessions </span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 shadow-sm">
                                      <span className="bg-green-100 p-2 rounded text-green-700 text-lg">👪</span>
                                      <span className="text-xs font-bold text-slate-700">Parent Seminar </span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 3: ASSESSMENT ENGINE */}
                      <div className="bg-white border-t-4 border-green-600 rounded-xl shadow-lg p-6 md:p-8 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
                          <h3 className="text-xl md:text-2xl font-bold text-green-900 mb-6 flex items-center border-b pb-4">
                              <span className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg shadow-md">3</span>
                              ASSESSMENT ENGINE
                          </h3>

                          <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                              {/* Structure */}
                              <div className="text-center space-y-2">
                                  <div className="w-40 mx-auto space-y-1">
                                      <div className="bg-green-600 text-white text-[10px] font-bold py-1 rounded-t">Grand Test (1)</div>
                                      <div className="bg-green-500 text-white text-[10px] font-bold py-1">Unit Tests (2)</div>
                                      <div className="bg-green-400 text-white text-[10px] font-bold py-1 rounded-b">Part Tests (8) </div>
                                  </div>
                                  <p className="text-xs font-bold text-slate-400">EXAM STRUCTURE</p>
                              </div>

                              {/* Question Focus */}
                              <div className="bg-green-50 px-6 py-4 rounded-xl border border-green-200 flex items-center gap-4">
                                  <div className="bg-white p-3 rounded-full border-2 border-green-500 text-2xl">✅</div>
                                  <div>
                                      <h5 className="font-bold text-green-900 text-sm">QUESTION TYPE FOCUS</h5>
                                      <p className="text-xs text-green-700 font-semibold">MCQ SINGLE CORRECT ONLY </p>
                                      <p className="text-[10px] text-green-600">(Targeting Advanced Level Difficulty)</p>
                                  </div>
                              </div>

                              {/* Modes */}
                              <div className="flex gap-4">
                                  <div className="text-center">
                                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-1 mx-auto">📄</div>
                                      <span className="text-[10px] font-bold text-slate-600">Offline (OMR)</span>
                                  </div>
                                  <div className="text-center">
                                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-1 mx-auto">📱</div>
                                      <span className="text-[10px] font-bold text-slate-600">Online (Tab)</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 4: ANALYTICS */}
                      <div className="bg-slate-900 rounded-xl shadow-xl p-8 text-white relative overflow-hidden group">
                          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                          
                          <div className="relative z-10">
                              <h3 className="text-xl font-bold text-teal-400 mb-6 flex items-center">
                                  <span className="bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                                  PERFORMANCE ANALYTICS
                              </h3>
                              
                              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                                          <span className="text-xs font-bold text-teal-400 block mb-2">RA DASHBOARD</span>
                                          <div className="w-32 h-20 bg-slate-700 rounded flex items-end justify-around pb-2 px-2">
                                              <div className="w-4 h-10 bg-blue-500 rounded-t"></div>
                                              <div className="w-4 h-14 bg-green-500 rounded-t"></div>
                                              <div className="w-4 h-8 bg-red-500 rounded-t"></div>
                                              <div className="w-4 h-12 bg-yellow-500 rounded-t"></div>
                                          </div>
                                      </div>
                                      <div className="text-3xl text-slate-600">➜</div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                      {['Student Report', 'Class Report', 'Teacher Report', 'School Report'].map((report, idx) => (
                                          <div key={idx} className="bg-slate-800 border border-slate-700 p-3 rounded text-center hover:bg-slate-700 transition-colors">
                                              <div className="text-xl mb-1">📊</div>
                                              <span className="text-[10px] font-bold text-slate-300">{report} </span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
            )}
            {/* --- 3. MAESTRO PROGRAM MODAL (Detailed View) --- */}
            {activeModal === 'program-maestro' && (
              <div className="w-full max-w-7xl mx-auto pb-12">
                  {/* Header */}
                  <div className="text-center mb-12 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-purple-600 rounded-full"></div>
                      <div className="pt-6">
                          <div className="inline-block p-3 rounded-full bg-purple-50 mb-4 border border-purple-100">
                              <MaestroIcon />
                          </div>
                          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">MAESTRO PROGRAM</h2>
                          <div className="inline-block bg-purple-700 text-white px-6 py-1 rounded-md text-sm md:text-lg font-bold shadow-md mb-2">
                              Holistic Academic Excellence Program for All-Round Development
                          </div>
                          <p className="text-slate-600 font-medium italic">"Vertical Expansion & Multi-Format Mastery"</p>
                      </div>
                  </div>

                  <div className="space-y-10">
                      
                      {/* SECTION 1: TOP TIER (Curriculum, Targets, Digital) */}
                      <div className="grid md:grid-cols-3 gap-6">
                          
                          {/* Col 1: Curriculum & Material (Blue Card) */}
                          <div className="bg-white border-t-4 border-blue-600 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                              <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center border-b border-blue-100 pb-2">
                                  <span className="text-2xl mr-2">📚</span>
                                  1. CURRICULUM
                              </h3>
                              <ul className="space-y-3 mb-6">
                                  <li className="flex items-center text-sm font-bold text-slate-700 bg-blue-50 p-2 rounded">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      Techno Curriculum
                                  </li>
                                  <li className="flex items-center text-sm font-bold text-slate-700 bg-blue-50 p-2 rounded">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      Advanced Curriculum
                                  </li>
                                  <li className="flex items-center text-sm font-bold text-slate-700 bg-blue-50 p-2 rounded">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      Vertical Expansion 
                                  </li>
                              </ul>
                              <div>
                                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Material</p>
                                  <div className="flex gap-2">
                                      <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">Concept Book</span>
                                      <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">Workbook</span>
                                  </div>
                              </div>
                          </div>

                          {/* Col 2: Targets (Orange/Center Highlight) */}
                          <div className="bg-gradient-to-b from-orange-50 to-white border-t-4 border-orange-500 rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center">
                              <div className="text-5xl mb-4 animate-pulse">🏆</div>
                              <h3 className="font-extrabold text-orange-900 text-xl mb-2">3. TARGET EXAMS</h3>
                              <div className="flex flex-wrap justify-center gap-2 mb-6">
                                  <span className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">Olympiads</span>
                                  <span className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">EAPCET</span>
                                  <span className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">NEET</span>
                                  <span className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">JEE Main</span>
                                  <span className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">JEE Advanced</span>
                              </div>
                              <div className="mt-auto inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-xs font-bold">
                                  Suitable for All Kinds of Students
                              </div>
                          </div>

                          {/* Col 3: Digital & Analytics (Teal Card) */}
                          <div className="bg-white border-t-4 border-teal-600 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                              <h3 className="font-bold text-teal-900 text-lg mb-4 flex items-center border-b border-teal-100 pb-2">
                                  <span className="text-2xl mr-2">💻</span>
                                  2. DIGITAL & ANALYTICS
                              </h3>
                              <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                      <div className="bg-teal-50 p-2 rounded text-teal-600 text-xl">☁️</div>
                                      <div>
                                          <h4 className="text-sm font-bold text-slate-800">10. DITP</h4>
                                          <p className="text-xs text-slate-500">Digital Content, Teacher Login & Teach</p>
                                      </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <div className="bg-teal-50 p-2 rounded text-teal-600 text-xl">📊</div>
                                      <div>
                                          <h4 className="text-sm font-bold text-slate-800">8. RA DASHBOARD</h4>
                                          <p className="text-xs text-slate-500">Reports: School, Class, Student, Teacher</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 2: ASSESSMENT & SKILL ARCHITECTURE (Purple Flow) */}
                      <div className="bg-purple-50/50 border-2 border-purple-100 rounded-3xl p-8 relative overflow-hidden">
                          <h3 className="text-center text-2xl font-extrabold text-purple-900 mb-10 uppercase tracking-wider">
                              4-7.Assessment & Skill Architecture
                          </h3>
                          
                          {/* Connected Circles Flow */}
                          <div className="grid md:grid-cols-4 gap-8 relative z-10">
                              {/* Step 1: Question Types */}
                              <div className="bg-white p-6 rounded-full aspect-square flex flex-col items-center justify-center text-center shadow-lg border-4 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all group">
                                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">❓</div>
                                  <h4 className="font-bold text-xs md:text-sm text-purple-900 mb-2">4. QUESTION TYPES</h4>
                                  <p className="text-[10px] text-slate-500 leading-tight">MCQ Single/Multi, Numerical, Assertion, Matrix</p>
                              </div>

                              {/* Arrow */}
                              <div className="hidden md:flex items-center justify-center text-purple-300 text-4xl">➜</div>

                              {/* Step 2: Skills Target */}
                              <div className="bg-white p-6 rounded-full aspect-square flex flex-col items-center justify-center text-center shadow-lg border-4 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all group">
                                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📶</div>
                                  <h4 className="font-bold text-xs md:text-sm text-purple-900 mb-2">5. SKILL LEVELS</h4>
                                  <div className="space-y-1">
                                      <span className="block text-[10px] bg-purple-50 px-2 rounded">Level 1</span>
                                      <span className="block text-[10px] bg-purple-50 px-2 rounded">Level 2</span>
                                      <span className="block text-[10px] bg-purple-50 px-2 rounded">Level 3</span>
                                  </div>
                              </div>

                              {/* Step 3: Exam Structure */}
                              <div className="bg-white p-6 rounded-full aspect-square flex flex-col items-center justify-center text-center shadow-lg border-4 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all group">
                                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📅</div>
                                  <h4 className="font-bold text-xs md:text-sm text-purple-900 mb-2">6. STRUCTURE</h4>
                                  <p className="text-xs font-bold text-slate-800">Total 25 Exams</p>
                                  <p className="text-[10px] text-slate-500">18 Part, 5 Unit, 2 Grand</p>
                              </div>

                              {/* Step 4: Modes */}
                              <div className="bg-white p-6 rounded-full aspect-square flex flex-col items-center justify-center text-center shadow-lg border-4 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all group">
                                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                                  <h4 className="font-bold text-xs md:text-sm text-purple-900 mb-2">7. MODES</h4>
                                  <div className="flex gap-2 justify-center">
                                      <span className="text-[10px] border border-purple-100 px-1 rounded">OMR</span>
                                      <span className="text-[10px] border border-purple-100 px-1 rounded">TAB</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 3: ECOSYSTEM SUPPORT (Green Gradient) */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 shadow-md">
                          <h3 className="text-center text-xl font-bold text-green-900 mb-8 uppercase bg-white inline-block px-6 py-2 rounded-full shadow-sm mx-auto flex">
                              Ecosystem Support & Development
                          </h3>
                          
                          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
                              {/* 11. Teacher Training */}
                              <div className="flex flex-col items-center text-center w-full md:w-1/4 group cursor-pointer">
                                  <div className="w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">👨‍🏫</div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-green-700">Teacher Training<br/>Workshop</p>
                              </div>
                              <div className="hidden md:block h-1 w-12 bg-green-200"></div>

                              {/* 12. Academic Audition */}
                              <div className="flex flex-col items-center text-center w-full md:w-1/4 group cursor-pointer">
                                  <div className="w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">🔍</div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-green-700">Academic<br/>Audition</p>
                              </div>
                              <div className="hidden md:block h-1 w-12 bg-green-200"></div>

                              {/* 13. Subject Enrichment */}
                              <div className="flex flex-col items-center text-center w-full md:w-1/4 group cursor-pointer">
                                  <div className="w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">🧠</div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-green-700">Subject Enrichment<br/>Sessions</p>
                              </div>
                              <div className="hidden md:block h-1 w-12 bg-green-200"></div>

                              {/* 14. Parent Seminar */}
                              <div className="flex flex-col items-center text-center w-full md:w-1/4 group cursor-pointer">
                                  <div className="w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">👪</div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-green-700">Parent<br/>Seminar</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            )}
            {/* --- 4. PIONEER PROGRAM MODAL (Detailed View) --- */}
            {activeModal === 'program-pioneer' && (
              <div className="w-full max-w-6xl mx-auto pb-12">
                  {/* Header */}
                  <div className="text-center mb-12 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-orange-600 rounded-full"></div>
                      <div className="pt-6">
                          <div className="inline-block p-3 rounded-full bg-orange-50 mb-4 border border-orange-100">
                              <PioneerIcon />
                          </div>
                          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">PIONEER PROGRAM</h2>
                          <div className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-1 rounded-md text-sm md:text-lg font-bold shadow-md mb-2">
                              ELITE ACADEMIC PROGRAM
                          </div>
                          <p className="text-slate-600 font-medium italic">"Empowering Future Leaders through Advanced Education & Holistic Support"</p>
                      </div>
                  </div>

                  <div className="space-y-8">
                      
                      {/* ROW 1: CURRICULUM & SKILLS PYRAMID */}
                      <div className="grid md:grid-cols-2 gap-8">
                          
                          {/* 1. Advanced Curriculum (Blue/Dark Theme) */}
                          <div className="bg-white border-t-4 border-blue-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex flex-col">
                              <h3 className="font-bold text-blue-900 text-xl mb-6 flex items-center border-b border-blue-100 pb-3">
                                  <span className="bg-blue-800 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shadow">1</span>
                                  ADVANCED CURRICULUM
                              </h3>
                              
                              <div className="space-y-4 flex-grow">
                                  <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-600">
                                      <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase">Curriculum Levels</h4>
                                      <ul className="space-y-2 text-sm text-slate-700">
                                          <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>a. CO Curriculum (Foundation)</li>
                                          <li className="flex items-center font-semibold"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>b. Advanced Plus Curriculum (Core)</li>
                                          <li className="flex items-center"><span className="w-2 h-2 bg-blue-800 rounded-full mr-2"></span>c. Higher Vertical Expansion </li>
                                      </ul>
                                  </div>

                                  <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                                      <div className="text-3xl">📚</div>
                                      <div>
                                          <h4 className="font-bold text-slate-800 text-xs uppercase">Learning Material</h4>
                                          <p className="text-xs text-slate-600">Vol 1 (Comprehensive) & Vol 2 (Advanced Applications)</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* 5. Skills Target (The Pyramid) */}
                          <div className="bg-white border-t-4 border-orange-500 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                              <h3 className="font-bold text-orange-900 text-xl mb-6 flex items-center border-b border-orange-100 pb-3">
                                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shadow">5</span>
                                  SKILLS TARGET (5-LEVEL MASTERY)
                              </h3>
                              
                              <div className="flex flex-col items-center justify-center space-y-1 w-full max-w-sm mx-auto pt-2">
                                  {/* Level 5 */}
                                  <div className="w-1/3 bg-red-600 text-white text-[10px] md:text-xs font-bold py-2 text-center rounded-t-lg shadow-sm transform hover:scale-105 transition-transform">
                                      L5: Rank Decider
                                  </div>
                                  {/* Level 4 */}
                                  <div className="w-1/2 bg-orange-500 text-white text-[10px] md:text-xs font-bold py-2 text-center shadow-sm transform hover:scale-105 transition-transform">
                                      L4: Challenger
                                  </div>
                                  {/* Level 3 */}
                                  <div className="w-2/3 bg-orange-400 text-white text-[10px] md:text-xs font-bold py-2 text-center shadow-sm transform hover:scale-105 transition-transform">
                                      L3: Critical Thinking
                                  </div>
                                  {/* Level 2 */}
                                  <div className="w-5/6 bg-blue-600 text-white text-[10px] md:text-xs font-bold py-2 text-center shadow-sm transform hover:scale-105 transition-transform">
                                      L2: Application
                                  </div>
                                  {/* Level 1 */}
                                  <div className="w-full bg-blue-800 text-white text-[10px] md:text-xs font-bold py-2 text-center rounded-b-lg shadow-sm transform hover:scale-105 transition-transform">
                                      L1: Foundation
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* ROW 2: TARGETS & QUESTIONS */}
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 shadow-md">
                          <h3 className="text-center font-bold text-slate-800 text-lg mb-8 uppercase tracking-widest border-b pb-2 inline-block mx-auto">
                              3 & 4. Targets & Question Architecture
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-12 relative">
                              {/* Connector Line (Desktop) */}
                              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-slate-300"></div>

                              {/* Targets */}
                              <div className="text-center group">
                                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-yellow-300 group-hover:scale-110 transition-transform">🎯</div>
                                  <h4 className="font-bold text-slate-900 mb-4">TARGET EXAMS</h4>
                                  <div className="flex flex-wrap justify-center gap-2">
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">Olympiads</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">EAPCET</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">NEET</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">JEE MAIN</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">JEE Advanced</span>
                                  </div>
                              </div>

                              {/* Question Types */}
                              <div className="text-center group">
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-blue-300 group-hover:scale-110 transition-transform">🧩</div>
                                  <h4 className="font-bold text-slate-900 mb-4">JEE ADVANCED FOCUS</h4>
                                  <div className="grid grid-cols-2 gap-2 text-left max-w-xs mx-auto">
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">✅ MCQ Single</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">☑️ MCQ Multiple</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">🔢 Numerical</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">🤔 Assertion</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">📖 Comprehension</span>
                                      <span className="text-[10px] bg-white px-2 py-1 border rounded">🔗 Matrix Match</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* ROW 3: ASSESSMENT STRUCTURE */}
                      <div className="bg-white border-t-4 border-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                          <h3 className="font-bold text-purple-900 text-xl mb-6 flex items-center border-b border-purple-100 pb-3">
                              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shadow">6 & 7</span>
                              ASSESSMENT STRUCTURE & MODES
                          </h3>
                          <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 w-full md:w-1/3 hover:scale-105 transition-transform">
                                  <div className="text-3xl mb-2">📅</div>
                                  <h4 className="font-bold text-purple-900 mb-1">25 TOTAL EXAMS</h4>
                                  <p className="text-xs text-slate-600">18 Part Tests • 5 Unit Tests • 2 Grand Tests</p>
                              </div>
                              <div className="text-2xl text-slate-300 hidden md:block">+</div>
                              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 w-full md:w-1/3 hover:scale-105 transition-transform">
                                  <div className="text-3xl mb-2">📝</div>
                                  <h4 className="font-bold text-purple-900 mb-1">DUAL MODES</h4>
                                  <div className="flex justify-center gap-4 mt-2">
                                      <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border">Offline (OMR)</span>
                                      <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border">Online (Tab)</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* ROW 4: ECOSYSTEM (Horizontal Scroll/Flow) */}
                      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" /></svg>
                          </div>
                          
                          <h3 className="font-bold text-orange-400 text-lg mb-8 uppercase tracking-widest text-center">
                              8-14. Ecosystem & Support (360° Development)
                          </h3>

                          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                              {[
                                  { id: 8, title: 'RA Dashboard', icon: '📊' },
                                  { id: 10, title: 'DITP', icon: '💻' },
                                  { id: 11, title: 'Teacher Training', icon: '👨‍🏫' },
                                  { id: 12, title: 'Academic Audition', icon: '📋' },
                                  { id: 13, title: 'Enrichment', icon: '🧠' },
                                  { id: 14, title: 'Parent Seminar', icon: '👪' },
                              ].map(item => (
                                  <div key={item.id} className="flex flex-col items-center group cursor-pointer">
                                      <div className="w-14 h-14 rounded-full border-2 border-slate-600 flex items-center justify-center text-2xl mb-2 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                          {item.icon}
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-300 text-center max-w-[80px]">{item.title}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                  </div>
              </div>
            )}

              {/* Content for Blog Modal */}
              {activeModal === 'blog' && (
                <BlogPage />
              )}

              {activeModal === 'events' && (
                <EventsPage />
              )}
            
          </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
             {/* USER REQUEST 1: Logo Placeholder */}
            <img 
              src={logo} 
              alt="Spectropy Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {['Home', 'Courses', 'Why Foundation', 'Happy Clients'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => openModal('blog')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => openModal('events')}
              className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              Client Services
            </button>
            
            {/* USER REQUEST 6: Contact Button */}
            <button 
               onClick={() => scrollToSection('contact-footer')}
               className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              Contact
            </button>

            {/* USER REQUEST 7: Login with Web Apps Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowLoginOptions(!showLoginOptions)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center"
              >
                Login
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {showLoginOptions && (
                <div className="absolute top-full right-0 mt-2 w-70 bg-blue-100 rounded-xl shadow-xl border border-slate-100 p-4 animate-fade-in z-50 flex flex-col gap-4">
                  <Link
                    to="/login"
                    className="block bg-white p-2 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-3">🖥️</div>
                    <h3 className="font-bold text-blue-800">E-Learning (LMS)</h3>
                    <p className="text-sm text-gray-600 mt-2">For students, teachers, and admins</p>
                  </Link>

                  <Link
                    to="https://ra-portal-frontend.vercel.app/login"
                    className="block bg-white p-2 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-bold text-blue-800">RA Portal</h3>
                    <p className="text-sm text-gray-500 mt-2">Results and Analysis Portal</p>
                  </Link>

                  <Link
                    to="https://academy.spectropy.com/s/authenticate?url=/"
                    className="block bg-white p-2 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-3">💻</div>
                    <h3 className="font-bold text-blue-800">DITP</h3>
                    <p className="text-sm text-gray-500 mt-2">Digital Interactive Teaching Product</p>
                  </Link>

                  <Link
                    to="https://lms.spectropy.com/"
                    className="block bg-white p-2 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-3">📱</div>
                    <h3 className="font-bold text-blue-800">Tab Exams</h3>
                    <p className="text-sm text-gray-500 mt-2">Online Assessment Platform</p>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 lg:hidden flex flex-col p-4 space-y-4">
            {['Home', 'Courses', 'Why Foundation', 'Happy Clients'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-left text-slate-700 font-medium py-2 border-b border-slate-50"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { openModal('blog'); setIsMobileMenuOpen(false); }}
              className="text-left text-slate-700 font-medium py-2 border-b border-slate-50"
            >
              Blog
            </button>
            <button
              onClick={() => { setActiveModal('events'); setIsMobileMenuOpen(false); }}
              className="text-left text-slate-700 font-medium py-2 border-b border-slate-50"
            >
              Events
            </button>
             <button
                onClick={() => scrollToSection('contact-footer')}
                className="text-left text-slate-700 font-medium py-2 border-b border-slate-50"
              >
                Contact
              </button>
            <div className="pt-2 flex flex-col gap-2">
               <span className="text-xs font-bold text-slate-400 uppercase">Login Options:</span>
               <Link
                 to="https://ra-portal-frontend.vercel.app/login"
                 className="bg-blue-50 text-blue-700 py-3 rounded-lg font-bold text-center block"
               >
                 RA Portal
               </Link>
               <Link
                 to="/login"
                 className="bg-blue-600 text-white py-3 rounded-lg font-bold text-center block"
               >
                 E-Learning
               </Link>
            </div>
          </div>
        )}
      </header>

      {/* --- SCROLL 1: HERO + PURPOSE --- */}
      <section id="home" className="relative min-h-screen flex flex-col pt-24 pb-12 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-white opacity-40 skew-x-12 transform translate-x-1/4 pointer-events-none"></div>

        {/* --- PART 1: HERO TEXT & BRIDGE VISUAL --- */}
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 mb-16">
          
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Foundation</span> of the Future 
            </h1>
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              The Purpose
            </div>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Strengthen academic foundation in formative years. We bridge the critical gap between classroom learning and competitive successful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <button 
                onClick={() => scrollToSection('courses')}
                className="flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Explore Courses <ArrowRightIcon />
              </button>
              <button 
                onClick={() => scrollToSection('why-foundation')}
                className="flex items-center justify-center bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Why Foundation Matters
              </button>
            </div>
          </div>

          {/* Visual Column: Bridge + Vision */}
          <div className="relative flex flex-col items-center">
            
            {/* 1. The Bridge Concept */}
            <div className="relative w-full aspect-video max-w-xl mb-6">
              <div className="relative z-10 bg-white p-5 md:p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-between h-full hover:scale-[1.02]">
                
                <div className="text-center mb-3">
                   <h3 className="inline-block px-3 py-1.5 bg-blue-100 text-blue-900 text-xl font-bold rounded-full uppercase tracking-wider mb-1">The Problem (The Gap)</h3>
                </div>

                {/* The Visual Bridge */}
                <div className="flex-grow flex items-center justify-between relative px-1">
                   {/* Left Pillar */}
                   <div className="flex flex-col items-center z-10">
                      <div className="w-16 h-24 bg-slate-200 rounded-t-lg border-x-2 border-t-2 border-slate-300 flex items-center justify-center">
                         <span className="text-4xl">🏫</span>
                      </div>
                      <span className="mt-2 font-bold text-slate-600 text-sm">Classroom </span>
                   </div>

                   {/* The Bridge & Gap */}
                   <div className="flex-grow h-full relative mx-2 flex flex-col justify-end pb-8 -mt-6">
                      <div className="absolute bottom-8 left-0 w-5/12 h-2 bg-red-400 rounded-l-full transform -rotate-6 origin-left"></div>
                      <div className="absolute bottom-8 right-0 w-5/12 h-2 bg-red-400 rounded-r-full transform rotate-6 origin-right"></div>
                      
                      {/* Gap Text */}
                      <div className="absolute top-1/4 left-0 right-0 text-center">
                         <span className="text-l text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Deep Conceptual Gaps </span>
                         <div className="text-2xl animate-bounce mt-1">⚡</div>
                      </div>

                      {/* Spectropy Solution Overlay */}
                      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                         <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg z-20">
                            Bridging the Gap 
                         </div>
                      </div>
                      <div className="absolute bottom-8 left-0 w-full h-2 bg-blue-500/30 rounded-full"></div>
                   </div>

                   {/* Right Pillar */}
                   <div className="flex flex-col items-center z-10">
                      <div className="w-16 h-24 bg-blue-100 rounded-t-lg border-x-2 border-t-2 border-blue-200 flex items-center justify-center">
                         <span className="text-4xl">🏆</span>
                      </div>
                      <span className="mt-2 font-bold text-slate-600 text-sm text-center leading-tight">Competitive<br/>Exams </span>
                   </div>
                </div>

                <div className="mt-0 text-center pt-0">
                  <p className="text-slate-500 text-xs md:text-sm">Weak fundamentals lead to exponential struggle in higher classes.</p>
                </div>
              </div>
            </div>

            {/* 2. The Vision Block (Added Below Problem Block) */}
            <div className="w-full max-w-xl bg-white rounded-2xl p-4 shadow-lg border border-indigo-100 flex items-center gap-4 transform hover:scale-[1.02] transition-transform">
                {/* Simple Image Placeholder */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-50 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl border border-indigo-100">
                    🚀
                </div>
                {/* Vision Text */}
                <div className="flex-grow">
                    <h4 className="text-indigo-900 font-extrabold text-sm md:text-base uppercase mb-1">The Vision: Future-Ready STEM Campus</h4>
                    <p className="text-slate-600 text-xs md:text-sm font-medium leading-snug">
                        A movement for India's next generation.<br/>
                        <span className="text-indigo-600 font-bold">Every child learns with confidence .</span>
                    </p>
                </div>
            </div>
            </div>
        </div>
        
        {/* --- PART 2: CHALLENGES & SOLUTION BLOCKS --- */}
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                
                {/* Core Challenges Block */}
                <div className="bg-red-50 rounded-3xl p-8 md:p-10 border border-red-100 relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 bg-red-200 text-red-800 text-xs font-bold px-3 py-1 rounded-bl-xl">THE PROBLEM</div>
                <div className="mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm mb-4">⚠️</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Core Challenges in Today's Learning </h3>
                    <p className="text-slate-700 mb-6">
                        Curriculum is theoretical, conceptual gaps increase over time, and schools often lack diagnostic Tracking.
                    </p>
                    <button 
                        onClick={() => openModal('challenges')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
                    >
                        More Info <ArrowRightIcon />
                    </button>
                </div>
                {/* Decorative BG element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl"></div>
                </div>

                {/* Spectropy Solution Block */}
                <div className="bg-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100 relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-bl-xl">THE SOLUTION</div>
                <div className="mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm mb-4">💡</div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Spectropy IIT Foundation & STEM Solution</h3>
                    <p className="text-slate-700 mb-6">
                        A comprehensive model with Structured Curriculum, AI Diagnostics, and Skill Development Ecosystem.
                    </p>
                    <button 
                        onClick={() => openModal('solution')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center"
                    >
                        More Info <ArrowRightIcon />
                    </button>
                </div>
                {/* Decorative BG element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl"></div>
                </div>

            </div>
        </div>
      </section>

      {/* --- SCROLL 2: CHALLENGES & SOLUTIONS (USER REQUEST 3 & 4) --- */}
      <section id="why-foundation" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              The Spectropy Solution Model
            </h2>
            <p className="text-lg text-slate-600">
              Traditional curriculums focus on rote memorization. We introduce application-based learning, diagnostics, and advanced STEM concepts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Structured STEM Curriculum</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Moving beyond theory. Our curriculum integrates Problem Solving, Critical Thinking, and Analytical Reasoning directly into Grades 6-10.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ChartIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Diagnostics & Reports</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Stop "flying blind". Our Tech Layer provides micro-analysis of student weaknesses with periodic tests and tab-based exams.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <ChipIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Tech Layer</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Seamless integration of Digital Teaching Content, Micro Learning Strategies, and Online Exams (OMR & Tab).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <UserGroupIcon />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ecosystem Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We empower the whole school: Teacher Training Workshops, Parent Seminars, and Subject Enrichment Sessions.
              </p>
            </div>
          </div>

          <div className="text-center">
             <button 
                onClick={() => scrollToSection('courses')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
             >
               View Our Solution Models
             </button>
          </div>
        </div>
      </section>

      <FutureFoundationSlider />

      {/* --- SCROLL 3: PROGRAMS + TRUST + CTA (USER REQUEST 5) --- */}
      <section id="courses" className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programs Designed for Excellence</h2>
            <p className="text-slate-400 max-w-2xl">Tailored academic architectures for every student's potential.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            {/* USER REQUEST 5: Future Foundation Program (New) */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition-all flex flex-col">
              <div className="mb-4"><FutureIcon /></div>
              <h3 className="text-xl font-bold mb-2">Future Foundation</h3>
              <p className="text-blue-300 font-medium mb-4 text-xs">Academic Core & Goals </p>
              <p className="text-slate-400 text-sm mb-6 flex-grow">Comprehensive blueprint bridging school curriculum with competitive excellence.</p>
              <button onClick={() => openModal('program-future')} className="text-blue-400 text-sm font-bold hover:text-white flex items-center self-start">
                More Info <ArrowRightIcon />
              </button>
            </div>

            {/* Catalyst Program */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-teal-500 transition-all flex flex-col">
              <div className="mb-4"><CatalystIcon /></div>
              <h3 className="text-xl font-bold mb-2">Catalyst Program</h3>
              <p className="text-teal-300 font-medium mb-4 text-xs">Bridge to Competitive </p>
              <p className="text-slate-400 text-sm mb-6 flex-grow">80% Foundation + 20% Advanced.Targeting NEET, EAPCET, Olympiads.</p>
              <button onClick={() => openModal('program-catalyst')} className="text-teal-400 text-sm font-bold hover:text-white flex items-center self-start">
                More Info <ArrowRightIcon />
              </button>
            </div>

            {/* Maestro Program */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition-all transform md:-translate-y-4 shadow-2xl flex flex-col z-10">
              <div className="mb-4"><MaestroIcon /></div>
              <h3 className="text-xl font-bold mb-2">Maestro Program</h3>
              <p className="text-purple-300 font-medium mb-4 text-xs">Holistic Excellence </p>
              <p className="text-slate-400 text-sm mb-6 flex-grow">Vertical Expansion & Advanced Curriculum for JEE Main & Advanced.</p>
              <button onClick={() => openModal('program-maestro')} className="text-purple-400 text-sm font-bold hover:text-white flex items-center self-start">
                More Info <ArrowRightIcon />
              </button>
            </div>

            {/* Pioneer Program */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-orange-500 transition-all flex flex-col">
              <div className="mb-4"><PioneerIcon /></div>
              <h3 className="text-xl font-bold mb-2">Pioneer Program</h3>
              <p className="text-orange-300 font-medium mb-4 text-xs">Elite Academic Program </p>
              <p className="text-slate-400 text-sm mb-6 flex-grow">Level 5 Mastery (Rank Decider) questions for top tier successful.</p>
              <button onClick={() => openModal('program-pioneer')} className="text-orange-400 text-sm font-bold hover:text-white flex items-center self-start">
                More Info <ArrowRightIcon />
              </button>
            </div>
          </div> 
        
                    {/* Happy Clients Slider - keep inside the Programs section */}
                    <div id="happy-clients" className="mb-20">                  
                    <HappyClientsSlider />
                    </div>

                 {/* --- COMBINED CONTACT SECTION */}
          <div id="contact-footer" className="py-20">
            
            <div className="container mx-auto px-6 mb-16">
              <p className="text-center text-slate-400 text-xs font-extrabold uppercase tracking-[0.2em] mb-8">
                Trusted by Forward-Thinking Campuses
              </p>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Visual Placeholders for Logos - Replace with <img /> if needed */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-300 hover:text-slate-500 transition-colors cursor-default">CITY SCHOOL</h3>
                <h3 className="text-xl md:text-2xl font-mono font-bold text-slate-300 hover:text-slate-500 transition-colors cursor-default">GLOBAL ACADEMY</h3>
                <h3 className="text-xl md:text-2xl font-sans font-black italic text-slate-300 hover:text-slate-500 transition-colors cursor-default">STEM HIGH</h3>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-300 hover:text-slate-500 transition-colors cursor-default">FUTURE FOUNDATION</h3>
              </div>
            </div>

            {/* Main CTA & Contact Block */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12 lg:p-16">
                    
                    {/* Abstract Background Decor */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        
                        {/* LEFT: Heading & Actions */}
                        <div className="text-center lg:text-left lg:w-1/2 space-y-6">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                Ready to Build a <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Future-Ready School?</span>
                            </h2>
                            <p className="text-blue-200 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Join the partner network transforming academic ecosystems. Let's discuss your school's vision today.
                            </p>                           
                        </div>

                        {/* RIGHT: Contact Details Card */}
                        <div className="lg:w-5/12 w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                            <div className="space-y-6">
                                
                                {/* Address */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <LocationIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-1 opacity-80">Headquarters</h4>
                                        <p className="text-blue-100 text-sm leading-relaxed">
                                            G94H+MJP, Beside Guru The Global School, <br/>Hyderabad, Telangana 500085
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                {/* Phones */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                                        <PhoneIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-1 opacity-80">Call Us</h4>
                                        <p className="text-blue-100 text-sm font-mono tracking-wide">
                                            +91 90143 41237
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                {/* Email */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <MailIcon />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-1 opacity-80">Email</h4>
                                        <p className="text-blue-100 text-sm">contact@spectropy.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>   
        </div>
      </section>

    </div>
  );
};

export default LandingPage;