import React, { useState, useEffect, useRef } from 'react';

// --- SLIDE DATA (Mapped from PDF & Extra Sources) ---
const slides = [
  {
    id: 1,
    source: "pdf",
    badge: "The Vision",
    title: "Bridging the Gap",
    headline: "Building Thinkers, Not Just Test Takers",
    description: "We bridge the critical divide between standard school curriculum and competitive readiness (JEE/NEET). Our integrated model ensures students excel in board exams while building a rock-solid foundation for the future.",
    color: "from-blue-600 to-indigo-700", // Spectropy Blue
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Bridge Metaphor Visual */}
        <svg className="w-48 h-48 text-white/90 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <div className="absolute bottom-10 left-10 text-white/50 text-xs font-bold uppercase tracking-widest">School</div>
        <div className="absolute bottom-10 right-10 text-white/50 text-xs font-bold uppercase tracking-widest">Competitive</div>
      </div>
    )
  },
  {
    id: 2,
    source: "pdf",
    badge: "Pedagogy",
    title: "The Cognitive Shift ",
    headline: "From Passive Memorization to Active Reasoning",
    description: "Traditional schooling often stops at 'Remember & Reproduce'. We shift the paradigm to 'Understand, Apply & Create', ensuring concepts are mastered, not just memorized.",
    color: "from-teal-500 to-emerald-600", // Growth Green
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Rote vs Conceptual Visual */}
        <div className="flex gap-4 items-center">
            <div className="text-center opacity-50 scale-75">
                <svg className="w-24 h-24 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                <p className="text-white text-xs mt-2">Rote</p>
            </div>
            <div className="text-white text-2xl font-bold">➜</div>
            <div className="text-center transform scale-110">
                <svg className="w-32 h-32 mx-auto text-white drop-shadow-xl animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="text-white font-bold text-sm mt-2">Conceptual</p>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    source: "pdf",
    badge: "Skills Framework",
    title: "Ladder to Mastery ",
    headline: "Building Cognitive Athletes",
    description: "Using Bloom's Taxonomy, we guide students up the cognitive ladder: Remember → Understand → Apply → Analyze → Evaluate → Create. This is the blueprint for a future-ready mind.",
    color: "from-purple-600 to-violet-700", // Academic Purple
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Staircase/Ladder Visual */}
        <svg className="w-40 h-40 text-white/90 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <div className="absolute top-1/4 right-1/4 bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm">Create</div>
        <div className="absolute bottom-1/4 left-1/4 bg-white/10 px-3 py-1 rounded-full text-white/70 text-xs backdrop-blur-sm">Remember</div>
      </div>
    )
  },
  {
    id: 4,
    source: "pdf",
    badge: "Assessment Engine",
    title: "The Mental Gym ",
    headline: "Training for the Academic Olympics",
    description: "Our assessment architecture isn't just about testing; it's about conditioning. With 25+ structured exams (Part, Unit, Grand) and diverse question types, we build resilience and speed.",
    color: "from-orange-500 to-red-500", // Assessment Energy
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Pyramid Visual */}
        <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-t-lg flex items-center justify-center text-white font-bold text-xs border border-white/40">Grand</div>
            <div className="w-24 h-12 bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xs border border-white/30">Unit Tests</div>
            <div className="w-36 h-12 bg-white/10 backdrop-blur-md rounded-b-lg flex items-center justify-center text-white font-bold text-xs border border-white/20">Part Tests</div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    source: "pdf",
    badge: "Analytics",
    title: "Mission Control [cite: 1125-1129]",
    headline: "AI-Driven Results & Analysis",
    description: "Stop flying blind. Our RA Dashboard acts like an MRI for education, identifying specific conceptual gaps ('fractures') and providing a personalized roadmap for healing.",
    color: "from-blue-800 to-slate-900", // Tech/Analytics
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Dashboard Visual */}
        <div className="w-64 h-40 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl relative overflow-hidden">
            <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex items-end gap-2 h-20">
                <div className="w-1/5 h-[40%] bg-blue-400/80 rounded-t"></div>
                <div className="w-1/5 h-[70%] bg-blue-400/80 rounded-t"></div>
                <div className="w-1/5 h-[50%] bg-blue-400/80 rounded-t"></div>
                <div className="w-1/5 h-[90%] bg-blue-400 rounded-t shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                <div className="w-1/5 h-[60%] bg-blue-400/80 rounded-t"></div>
            </div>
            {/* Search Icon Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    source: "illustration",
    badge: "The Outcome",
    title: "Future-Ready Students",
    headline: "Confident, Curious, & Competitive",
    description: "Beyond exams, we nurture a scientific temper. Our students don't just solve problems; they identify them. They are ready for IITs, Olympiads, and the challenges of the future.",
    color: "from-indigo-600 to-purple-600", // Future/Aspiration
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Illustrative Student Icon */}
        <div className="relative">
            <svg className="w-40 h-40 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* Orbiting Icons */}
            <div className="absolute -top-4 -right-4 bg-white text-indigo-600 rounded-full p-2 text-xl font-bold shadow-lg animate-bounce">A+</div>
            <div className="absolute -bottom-4 -left-4 bg-white text-indigo-600 rounded-full p-2 text-xl shadow-lg">⚛️</div>
        </div>
      </div>
    )
  }
];

const FutureFoundationSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const length = slides.length;
  const delay = 5000; // 5 seconds autoplay

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, delay);
    return () => resetTimeout();
  }, [current, isPaused, length]);

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  return (
    <section 
      className="w-full bg-slate-50 py-16 px-4 md:px-8 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            The Future Foundation Vision
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore how we are redefining academic excellence through our integrated 4-pillar ecosystem.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative w-full h-[550px] md:h-[450px] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 group">
          
          {/* Slides - horizontal scroller */}
          <div className="w-full h-full overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0 h-full">
                  <div className="flex flex-col md:flex-row h-full">

                    {/* Text Content (Left on Desktop) */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white order-2 md:order-1 h-1/2 md:h-full relative z-20">
                      <div className={`inline-block self-start px-4 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full border bg-opacity-10 text-slate-700 border-slate-200 bg-slate-100`}>
                        {slide.badge}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                        {slide.headline}
                      </h3>
                      <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-6">
                        {slide.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mt-auto md:mt-0">
                        <span className="w-8 h-px bg-slate-300"></span>
                        <span>{slide.title}</span>
                      </div>
                    </div>

                    {/* Visual Content (Right on Desktop) */}
                    <div className={`w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden order-1 md:order-2 bg-gradient-to-br ${slide.color} flex items-center justify-center`}>
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
                      
                      {/* Central Visual */}
                      <div className="relative z-10 transform transition-transform duration-1000 scale-100 hover:scale-105">
                        {slide.visual}
                      </div>

                      {/* Source Note (Subtle) */}
                      <div className="absolute bottom-4 right-4 text-white text-[9px] opacity-30 font-mono">
                        Src: {slide.source}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 md:top-1/2 top-[30%] transform -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Previous Slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 md:top-1/2 top-[30%] transform -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
            aria-label="Next Slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 md:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                  index === current ? 'bg-blue-600 w-8' : 'bg-slate-300 w-2 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FutureFoundationSlider;