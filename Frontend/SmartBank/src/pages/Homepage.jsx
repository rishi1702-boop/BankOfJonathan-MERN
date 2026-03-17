import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ShieldCheck, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Your Money, Your Control",
    subtitle: "Experience the future of banking with seamless transactions, intelligent insights, and unparalleled security.",
  },
  {
    title: "Instant AI Transfers",
    subtitle: "Send money globally in seconds validated by BankOfJonathan's cutting-edge AI.",
  },
  {
    title: "Bank-Grade Encryption",
    subtitle: "Rest easy knowing every transaction is secured by state-of-the-art HTTP-only cookies and bcrypt hashing.",
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 relative overflow-hidden font-sans">
      
      {/* Pre-auth Navbar */}
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center px-6 py-5 bg-transparent">
        <div 
          className="flex items-center space-x-2 text-white font-black text-2xl cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/10">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span>BankOfJonathan</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/login"
            className="flex items-center space-x-1 text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <Link 
            to="/register"
            className="flex items-center space-x-1 bg-white text-indigo-900 font-bold px-5 py-2 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </Link>
        </div>
      </nav>

      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-20">
        
        {/* Logo Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl mb-10"
        >
          <Wallet className="w-12 h-12 text-blue-400" />
        </motion.div>

        {/* Hero Slider */}
        <div className="h-[200px] flex flex-col items-center justify-center w-full max-w-4xl text-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
            >
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-tight drop-shadow-sm mb-6">
                {slides[currentSlide].title}
              </h1>
              <p className="mt-2 mx-auto text-blue-100/80 text-lg md:text-2xl font-light max-w-2xl leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="flex space-x-2 mt-8 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md"
        >
          <Link
            to="/register"
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 text-lg group"
          >
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Lightning Fast", desc: "Instant AI-powered transactions." },
            { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, title: "Bank-Grade Security", desc: "Advanced encryption & HTTP-only cookies." },
            { icon: <Wallet className="w-6 h-6 text-blue-400" />, title: "Smart Tracking", desc: "Watch your wealth grow in real-time." }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-default">
              <div className="mb-4 p-3 bg-white/10 rounded-full shadow-inner">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-blue-100/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-indigo-300/50 text-sm font-medium tracking-wide z-10">
        © {new Date().getFullYear()} BankOfJonathan. Built with MERN & Framer Motion.
      </footer>
    </div>
  );
}
