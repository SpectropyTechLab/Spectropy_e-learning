// src/pages/auth/LandingPage.tsx
import { useState,useEffect  } from 'react';
import { Link } from 'react-router-dom';

const sliderImages = [
  'https://spectropy.com/wp-content/uploads/2023/02/5281999.png',
  'https://spectropy.com/wp-content/uploads/2025/02/7-1024x544.png',
  'https://spectropy.com/wp-content/uploads/2025/02/8-1024x544.png',
];

const services = [
  {
    id: 'iit-foundation',
    title: 'IIT Foundation',
    shortDesc: 'Build strong conceptual clarity from Class 6 onwards to crack JEE with confidence.',
    fullDesc: (
      <>
        <p className="mb-4">
          Our IIT Foundation program is designed for students from <strong>Class 6 to 10</strong> to build a rock-solid conceptual base in Physics, Chemistry, and Mathematics—the core pillars for JEE and other competitive exams.
        </p>
        <p className="mb-4">
          We blend <strong>NCERT fundamentals</strong> with <strong>Olympiad-level problem-solving</strong>, ensuring students develop both depth and analytical thinking.
        </p>
        <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Weekly live doubt-clearing sessions with expert mentors</li>
          <li>Concept maps & mind-building worksheets</li>
          <li>Monthly foundation-level mock tests with performance analytics</li>
          <li>Personalized feedback from IIT-qualified educators</li>
          <li>Early exposure to competitive exam patterns</li>
        </ul>
        <p className="mt-4">
          Start early. Think big. Lay the foundation for JEE/NEET success.
        </p>
      </>
    ),
  },
  {
    id: 'online-exams',
    title: 'Online Exams',
    shortDesc: 'Take timed mock tests simulating real exam conditions for better performance.',
    fullDesc: (
      <>
        <p className="mb-4">
          Our Online Exam Platform replicates the pressure and structure of real engineering and medical entrance exams—helping students build speed, accuracy, and confidence.
        </p>
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Timed tests with auto-proctoring (optional)</li>
          <li>Instant result with detailed answer explanations</li>
          <li>Chapter-wise, topic-wise, and full-syllabus test series</li>
          <li>All India ranking & percentile analysis</li>
          <li>Performance trend graphs and weak-area detection</li>
        </ul>
        <p className="mt-4">
          Practice like it's the real thing—so on D-day, you’re ready.
        </p>
      </>
    ),
  },
  {
    id: 'customized-programs',
    title: 'Customized Programs',
    shortDesc: 'Tailored learning paths designed for your child’s pace, strengths, and goals.',
    fullDesc: (
      <>
        <p className="mb-4">
          Every student is unique. Our Customized Programs adapt to your child’s learning style, pace, and academic goals—whether they’re aiming for JEE Advanced, NEET, or state-level excellence.
        </p>
        <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Initial diagnostic assessment to identify strengths & gaps</li>
          <li>Personalized study plan with weekly milestones</li>
          <li>1:1 mentoring sessions (on subscription)</li>
          <li>Flexible scheduling across weekdays/weekends</li>
          <li>Parent dashboard for real-time progress tracking</li>
        </ul>
        <p className="mt-4">
          Because one-size-fits-all doesn’t work in education.
        </p>
      </>
    ),
  },
];

const LandingPage = () => {
    const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const closeModal = () => setSelectedService(null);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };


  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 🔸 Watermark Background */}
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "url('watermak.pgn')",
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      />
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-950 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://spectropy.com/wp-content/uploads/2023/02/final-blue-white-bg.png"
              alt="Spectropy Logo"
              className="h-10 rounded-md"
            />
          </div>

          <nav className="flex space-x-6 text-white font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
            <a href="#login-portals" className="hover:text-blue-600 font-medium">
              Login
            </a>
            <a href="#explore" className="hover:text-blue-600">Explore</a>
          </nav>
        </div>
      </header>

      {/* 🔸 IMAGE SLIDER */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full w-fit"
            style={{ transform: `translateX(-${currentSlide * 100}%)`, width: `${sliderImages.length * 100}%` }}
          >
            {sliderImages.map((img, index) => (
              <div key={index} className="h-full w-full shrink-0 object-contain flex align-center">
                
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="max-w-full max-h-full object-contain shrink-0"
                />
              </div>
            ))}
          </div>

          {/* Slide Indicators (Dots) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      {/* Hero / Services Section */}
      <main className="grow container mx-auto px-4 py-12">
        {/* Three Service Blocks with "More about" links */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
  {services.map((item) => (
    <div
      key={item.id}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
    >
      <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>
      <p className="text-gray-600 mb-4">{item.shortDesc}</p>
      <button
        onClick={() => setSelectedService(item)}
        className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
      >
        More about →
      </button>
    </div>
  ))}
</div>

        {/* 4 Persuasive Lines */}
        <div className="text-center mb-16 space-y-3 text-gray-700">
          <p>🏆 Trusted by 50,000+ Students Across India</p>
          <p>📈 95% Success Rate in Top Engineering Entrance Exams</p>
          <p>👨‍🏫 Expert Faculty with 10+ Years of Teaching Experience</p>
          <p>📱 Access Anytime, Anywhere — Learn at Your Own Pace</p>
        </div>

        {/* 🔑 LOGIN PORTALS SECTION */}
        <section id="login-portals" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Login to Your Portal</h2>
            <p className="text-gray-600 mt-2">Select the platform you use</p>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/login"
              className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">🖥️</div>
              <h3 className="font-bold text-blue-800">E-Learning (LMS)</h3>
              <p className="text-sm text-gray-600 mt-2">For students, teachers, and admins</p>
            </Link>

            <Link 
            to="https://ra-portal-frontend.vercel.app/login"
            className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-100 transition-all text-center hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-blue-800">RA Portal</h3>
              <p className="text-sm text-gray-500 mt-2">Results and Analysis Portal</p>
            </Link>
          </div>
        </section>

        {/* Happy Clients with Logo Placeholders */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Happy Clients</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {/* Replace these with real logo URLs later */}
            {[
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfSrFFpfWSUTp-Eqp6k9vSiVyyhju0xzHMRg&s',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKhYHsDIzoiLLVblksrmiOaVQ-dNVTo8DAtQ&s',
              'https://spectropy.com/wp-content/uploads/2024/03/logo-msn-High-school-1004x1024.png',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrE23ghi1mCZf8uusWoLlJ7WSxtNeXOA_PgA&s',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRej_DGTs81iadaEabcIRIb9LE31C3FIT5y1Q&s',
            ].map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt={`Client ${i + 1}`}
                className="h-18 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Crash Course', 'Full Syllabus Package', 'Personal Mentorship'].map((p, i) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow text-center">
                <h3 className="font-semibold text-lg">{p}</h3>
                <p className="text-sm text-gray-600 mt-2">Comprehensive learning solution</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ ABOUT US SECTION */}
        <section id="about" className="mb-16">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">About Spectropy</h2>
            <div className="text-gray-700 text-lg leading-relaxed space-y-5 max-w-4xl mx-auto">
              <p>
                <strong>📘 Spectropy Education Technologies — Architects of a Brighter Educational Future</strong>
              </p>
              <p>
                Headquartered in Hyderabad, Spectropy is more than an EdTech company—we are a movement. Born from a vision in 2017 and officially registered in 2022, we’ve grown from a home-office startup into a trusted partner for over 100 schools and 20 junior colleges across India.
              </p>
              <p>
                <strong>Our Mission:</strong> We believe education should be accessible, engaging, and personalized. By bridging the gap between teachers and students through intelligent digital tools, we foster collaborative, data-driven learning environments where every learner can thrive.
              </p>
              <p>
                <strong>Our Solutions:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Learning Management System (LMS)</strong> – Centralize curriculum, assignments, and communication.</li>
                <li><strong>AI-Ready Question Paper Generator</strong> – Create customized assessments from dynamic, syllabus-aligned question banks.</li>
                <li><strong>IIT/NEET Foundation Analytics</strong> – Real-time performance tracking in Physics, Chemistry, Maths, and Biology.</li>
                <li><strong>Role-Based Portals</strong> – Secure, intuitive dashboards for schools, teachers, students, and parents.</li>
              </ul>
              <p>
                <strong>Impact at Scale:</strong> From classroom instruction to institutional strategy, Spectropy empowers educators with cutting-edge tools while inspiring students to reach their full potential—because we believe every child deserves the opportunity to succeed.
              </p>
              <div className="text-center mt-6">
                <Link
                  to="/about"
                >
                </Link>
              </div>
            </div>
        </section>
        {/* === MODAL === */}
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white bg-opacity-50">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-blue-900">{selectedService.title}</h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-800 text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="mt-6 text-gray-700 leading-relaxed">
                    {selectedService.fullDesc}
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
          )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8" id="contact">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">📞 +91 93912 94429 (10:00 AM – 7:00 PM)</p>
          <p className="mb-2">✉️ contact@spectropy.com</p>
          <p className="mb-4">📍 Hyderabad, India</p>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Spectropy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default LandingPage;