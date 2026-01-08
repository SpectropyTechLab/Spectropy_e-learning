import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Target, Monitor, Brain, 
  BarChart3, FileText, Users, Layers, 
  CheckCircle, ChevronRight, GraduationCap
} from 'lucide-react';

// --- 1. BLOOM'S TAXONOMY ANIMATION (Recreating your GIF via Code) ---
const BloomsStaircase = () => {
  const steps = [
    { id: 1, label: "Remember", color: "bg-blue-100 border-blue-300 text-blue-700", h: "h-14", delay: 0 },
    { id: 2, label: "Understand", color: "bg-amber-100 border-amber-300 text-amber-700", h: "h-20", delay: 0.5 },
    { id: 3, label: "Apply", color: "bg-emerald-100 border-emerald-300 text-emerald-700", h: "h-28", delay: 1.0 },
    { id: 4, label: "Analyse", color: "bg-indigo-100 border-indigo-300 text-indigo-700", h: "h-36", delay: 1.5 },
    { id: 5, label: "Evaluate", color: "bg-rose-100 border-rose-300 text-rose-700", h: "h-44", delay: 2.0 },
    { id: 6, label: "Create", color: "bg-purple-100 border-purple-300 text-purple-700", h: "h-52", delay: 2.5 },
  ];

  return (
    <div className="w-full h-full flex items-end justify-center gap-2 px-4 pb-4">
      {steps.map((step) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: step.delay, duration: 0.5, type: "spring" }}
          className="flex flex-col items-center justify-end w-1/6"
        >
          {/* Label Bubble */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: step.delay + 0.3 }}
            className="mb-2 bg-white px-2 py-1 rounded shadow-sm border border-slate-100 text-center"
          >
            <span className="text-[10px] font-bold text-slate-600 block">{step.id}. {step.label}</span>
          </motion.div>
          
          {/* The Stair */}
          <div className={`w-full ${step.h} ${step.color} border-t-4 rounded-t-lg shadow-md relative overflow-hidden group`}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
            {/* Number inside stair */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-black/10 text-2xl font-black">{step.id}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- 2. ASSESSMENT PYRAMID (Recreating your Graphic via Code) ---
const AssessmentPyramid = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-48 text-center space-y-1 drop-shadow-lg">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-orange-600 text-white text-xs font-bold py-3 rounded-t-xl"
        >
          Grand Test (1)
        </motion.div>
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-orange-500 text-white text-xs font-bold py-3 w-[90%] mx-auto"
        >
          Unit Tests (2)
        </motion.div>
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}
          className="bg-orange-400 text-white text-xs font-bold py-3 w-[80%] mx-auto rounded-b-xl"
        >
          Part Tests (8)
        </motion.div>
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Structure</p>
    </div>
  );
};

// --- MAIN PRESENTATION COMPONENT ---
const AutoPresentation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const DURATION = 6000; // 6 seconds per slide

  // Automatic Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, DURATION);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      id: 1,
      title: "Foundation & Targets",
      desc: "NCERT Curriculum & Competitive Goals",
      color: "bg-blue-600",
      content: (
        <div className="grid grid-cols-2 gap-6 h-full p-6">
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><BookOpen size={18}/> Curriculum</h4>
              <p className="text-xs text-slate-600">Integrated NCERT / SCERT / State Board content with Conceptual Synopsis.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-2">Learning Material</h4>
              <div className="flex gap-2 text-[10px] font-bold text-slate-500 uppercase">
                <span className="bg-slate-100 px-2 py-1 rounded">Synopsis</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Class Work</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Home Work</span>
              </div>
            </div>
          </div>
          {/* Graphic: Mountain Target */}
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover" alt="Target" />
            <div className="absolute inset-0 bg-blue-900/60 flex flex-col items-center justify-center text-white text-center p-4">
              <Target size={48} className="mb-2 text-red-400" />
              <h3 className="font-bold text-lg">TARGET EXAMS</h3>
              <p className="text-xs text-blue-100">JEE • NEET • EAPCET • Olympiads</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Pedagogy & Skills",
      desc: "Digital Teaching & Cognitive Growth",
      color: "bg-indigo-600",
      content: (
        <div className="flex flex-col h-full">
          {/* Top Row: DITP & Training */}
          <div className="grid grid-cols-2 gap-4 p-6 pb-2">
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-center gap-3">
              <Monitor className="text-indigo-600" />
              <div>
                <h5 className="font-bold text-xs text-indigo-900">DITP</h5>
                <p className="text-[10px] text-indigo-600">Digital Interactive Teaching</p>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center gap-3">
              <Users className="text-purple-600" />
              <div>
                <h5 className="font-bold text-xs text-purple-900">Workshops</h5>
                <p className="text-[10px] text-purple-600">Teacher Training</p>
              </div>
            </div>
          </div>
          {/* Bottom Row: The Animation */}
          <div className="flex-grow relative bg-slate-50 border-t border-slate-200">
            <div className="absolute top-2 left-0 right-0 text-center">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Bloom's Taxonomy Progression</span>
            </div>
            <BloomsStaircase />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Assessment Regime",
      desc: "Testing Structure & Question Types",
      color: "bg-orange-500",
      content: (
        <div className="grid grid-cols-2 h-full">
          {/* Left: Pyramid Graphic */}
          <div className="bg-orange-50 p-6 border-r border-orange-100">
            <AssessmentPyramid />
          </div>
          {/* Right: Question Types */}
          <div className="p-6 flex flex-col justify-center">
            <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase">Question Types</h4>
            <div className="grid grid-cols-1 gap-2">
              {['Single Correct MCQ', 'Multi Correct MCQ', 'Numerical Type', 'Comprehension', 'Matrix Matching'].map((q, i) => (
                <motion.div 
                  key={q}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  {q}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Analytics & Support",
      desc: "Dashboards & Feedback",
      color: "bg-teal-500",
      content: (
        <div className="h-full flex flex-col">
          {/* Top: Dashboard Image */}
          <div className="h-1/2 relative overflow-hidden">
             <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover" alt="Dashboard" />
             <div className="absolute bottom-0 w-full bg-slate-900/80 p-2 text-center">
                <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">RA Dashboard Results</span>
             </div>
          </div>
          {/* Bottom: Reports */}
          <div className="h-1/2 bg-white p-6 grid grid-cols-2 gap-4 items-center">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><FileText size={14} className="text-teal-500"/> School Report</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><FileText size={14} className="text-teal-500"/> Student Report</div>
             </div>
             <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                <Users className="mx-auto mb-1 text-yellow-600" size={20}/>
                <h5 className="font-bold text-slate-800 text-xs">Parent Seminar</h5>
             </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden flex font-sans border border-slate-200">
      
      {/* --- LEFT PANEL (1/4) --- */}
      <div className="w-1/4 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200 bg-white">
          <h2 className="font-black text-lg text-slate-800 leading-none">FUTURE<br/><span className="text-blue-600">FOUNDATION</span></h2>
        </div>
        <div className="flex-grow flex flex-col">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`relative flex-1 px-5 flex flex-col justify-center transition-colors duration-300 ${activeStep === index ? 'bg-white' : 'text-slate-400'}`}
            >
              {/* Active Step Indicator Line */}
              {activeStep === index && (
                <motion.div layoutId="activeLine" className={`absolute left-0 top-0 bottom-0 w-1 ${section.color}`} />
              )}
              
              {/* Progress Bar (Bottom of active item) */}
              {activeStep === index && (
                <motion.div 
                  className={`absolute bottom-0 left-0 h-1 ${section.color} opacity-20`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}

              <div className="relative z-10">
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${activeStep === index ? 'text-slate-500' : 'text-slate-300'}`}>Step 0{index + 1}</span>
                <h3 className={`font-bold text-sm leading-tight ${activeStep === index ? 'text-slate-800' : 'text-slate-400'}`}>{section.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT PANEL (3/4) --- */}
      <div className="w-3/4 relative bg-slate-100 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full w-full"
          >
            {/* White Card Container */}
            <div className="h-full w-full bg-white">
              {sections[activeStep].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AutoPresentation;