"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  useReducedMotion,
  animate
} from "motion/react";
import {
  Shield,
  ThumbsUp,
  Activity,
  Menu,
  X,
  ArrowRight,
  Star,
  Mail,
  Phone,
  Cloud,
  Lock
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

// Reusable Typewriter Component (Scroll-triggered Character Reveal)
function Typewriter({ text, delay = 0, speed = 0.015, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-10px" });

  const parentVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const characters = text.split("");

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={parentVariants}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={childVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Reusable Animated Counter Component (Scroll-triggered Value Count-up)
function AnimatedCounter({ value, suffix = "", prefix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(val) {
          if (ref.current) {
            ref.current.textContent = prefix + val.toFixed(decimals) + suffix;
          }
        }
      });
    }
  }, [inView, value, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// Parallax Floating Black Square Component for Case Studies Header
function ParallaxFloatingSquare({ sq, index, targetRef }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -(80 + index * 30)]);
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      style={{
        left: `${sq.x}%`,
        top: `${sq.y}%`,
        width: `${sq.size}px`,
        height: `${sq.size}px`,
        y: smoothY,
      }}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3
      }}
      className="absolute bg-primary/20 border border-primary/20 rounded-sm"
    />
  );
}

// Interactive Case Study Card Component with Pixel Dissolve & Magnetic Squares
function CaseStudyCardItem({ card, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 80, damping: 18, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const rows = 8;
  const cols = 12;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[16/10] overflow-hidden bg-black cursor-pointer"
    >
      {/* Background Media (Video or Image) */}
      {card.isVideo ? (
        <video
          src={card.media}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={card.media || card.image}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Pixel Dissolve Hover Overlay (12 cols x 8 rows) */}
      <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-12 grid-rows-8">
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const delayIn = (r + c) * 0.018;
          const delayOut = ((8 - r) + (12 - c)) * 0.012;

          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{
                duration: 0.25,
                delay: hovered ? delayIn : delayOut,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="bg-black/80 w-full h-full"
            />
          );
        })}
      </div>

      {/* Magnetic Squares Layer */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {card.magneticSquares.map((sq, sqIdx) => {
          const shiftX = useTransform(smoothMouseX, [0, 1], [-20 * (sqIdx + 1), 20 * (sqIdx + 1)]);
          const shiftY = useTransform(smoothMouseY, [0, 1], [-20 * (sqIdx + 1), 20 * (sqIdx + 1)]);

          return (
            <motion.div
              key={sqIdx}
              style={{
                left: `${sq.x}%`,
                top: `${sq.y}%`,
                width: `${sq.size}px`,
                height: `${sq.size}px`,
                x: shiftX,
                y: shiftY,
              }}
              className="absolute bg-black shadow-lg"
            />
          );
        })}
      </div>

      {/* Plus Button (top right) */}
      <div className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center border border-white/30 text-xs text-white font-sans">
        +
      </div>

      {/* Info Plate (bottom left) */}
      <div className="absolute bottom-0 left-0 z-20 max-w-[50%] sm:max-w-[45%] bg-white px-2.5 pb-2 pt-1.5 text-left">
        <h3 className="text-[13px] sm:text-[14px] font-semibold leading-tight text-black font-sans">
          {card.title}
        </h3>
        <div className="mt-0.5 flex items-center gap-2.5 text-[10px] font-sans">
          <span className="text-black/60">{card.category}</span>
          <span className="font-medium text-black">{card.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Monitor Scroll for Navbar Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Watermark SVG measurement effect for Kresna Footer
  useEffect(() => {
    function fitWatermark() {
      const svg = document.getElementById('watermarkSvg');
      const text = document.getElementById('watermarkText');
      if (!svg || !text) return;
      try {
        const bbox = text.getBBox();
        svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      } catch (e) {}
    }
    if (typeof document !== 'undefined') {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fitWatermark);
      } else {
        window.addEventListener('load', fitWatermark);
      }
      window.addEventListener('resize', fitWatermark);
      fitWatermark();
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', fitWatermark);
      }
    };
  }, []);

  // Navbar Items
  const navItems = ["Home", "About Us", "Solutions", "Services", "Testimonials", "Contact"];

  const servicesRef = useRef(null);

  // Floating Squares Data for Case Studies Header
  const headerSquares = [
    { x: 6, y: 20, size: 12 },
    { x: 12, y: 32, size: 8 },
    { x: 8, y: 44, size: 6 },
    { x: 88, y: 18, size: 10 },
    { x: 92, y: 30, size: 14 },
    { x: 85, y: 42, size: 7 },
    { x: 90, y: 52, size: 5 },
    { x: 14, y: 56, size: 5 },
  ];

  // Case Studies Data
  const caseStudiesData = [
    {
      id: "cloud-devops",
      title: "Cloud & DevOps Architecture",
      category: "Infrastructure & Security",
      year: "2026",
      media: "/service.mp4",
      isVideo: true,
      magneticSquares: [
        { x: 5, y: 30, size: 16 },
        { x: 10, y: 42, size: 10 },
        { x: 3, y: 52, size: 7 },
        { x: 80, y: 70, size: 14 },
        { x: 85, y: 82, size: 9 },
        { x: 78, y: 60, size: 6 }
      ]
    },
    {
      id: "software-engineering",
      title: "Custom Software Engineering",
      category: "Web & Mobile Platforms",
      year: "2026",
      media: "/service1.mp4",
      isVideo: true,
      magneticSquares: [
        { x: 82, y: 55, size: 16 },
        { x: 88, y: 68, size: 10 },
        { x: 78, y: 72, size: 7 },
        { x: 85, y: 42, size: 6 },
        { x: 90, y: 80, size: 8 }
      ]
    },
    {
      id: "cyber-security",
      title: "Cyber Security & Auditing",
      category: "Threat Defense & Uptime",
      year: "2025",
      media: "/service2.mp4",
      isVideo: true,
      magneticSquares: [
        { x: 4, y: 24, size: 16 },
        { x: 10, y: 36, size: 10 },
        { x: 2, y: 44, size: 7 },
        { x: 78, y: 78, size: 14 },
        { x: 84, y: 88, size: 8 }
      ]
    },
    {
      id: "ai-consulting",
      title: "AI Integration & IT Consulting",
      category: "Automation & Strategy",
      year: "2025",
      media: "/service3.mp4",
      isVideo: true,
      magneticSquares: [
        { x: 82, y: 26, size: 14 },
        { x: 88, y: 38, size: 10 },
        { x: 78, y: 44, size: 7 },
        { x: 84, y: 54, size: 5 },
        { x: 90, y: 60, size: 8 }
      ]
    }
  ];

  // Marquee Client Logos
  const marqueeLogos = [
    {
      name: "Codecraft_",
      icon: (
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 4 1 9 6 14" />
          <polyline points="16 4 21 9 16 14" />
          <line x1="13" y1="2" x2="9" y2="16" />
        </svg>
      )
    },
    {
      name: "ennLabs",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {[3, 10, 17].map(x => [3, 10, 17].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />))}
        </svg>
      )
    },
    {
      name: "GlobalBank",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="9" />
          <circle cx="11" cy="11" r="4" />
        </svg>
      )
    },
    {
      name: "45 Degrees°",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="16" x2="16" y2="2" />
          <polyline points="7 2 16 2 16 11" />
        </svg>
      )
    },
    {
      name: "AlphaWave",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="9" />
          <path d="M5 11Q8 7 11 11Q14 15 17 11" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      name: "Biosynthesis",
      icon: (
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="0" y1="3" x2="24" y2="3" />
          <line x1="6" y1="9" x2="24" y2="9" />
          <line x1="0" y1="15" x2="18" y2="15" />
        </svg>
      )
    },
    {
      name: "Boltshift",
      icon: (
        <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
          <polygon points="8,0 0,11 6,11 6,20 14,9 8,9" />
        </svg>
      )
    },
    {
      name: "Clandestine",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <rect x="7.5" y="0" width="3" height="18" />
          <rect x="0" y="7.5" width="18" height="3" />
        </svg>
      )
    }
  ];

  // Hero Section: Carousel State
  const heroCarouselImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroCarouselImages.length]);

  // Parallax Scroll Effect for Hero Image
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 60]);

  // Trust Cards Data
  const trustCards = [
    {
      icon: Shield,
      title: "Security",
      desc: "To us protection is not just important, it's a necessity. Guarantee your infrastructure's uptime.",
    },
    {
      icon: ThumbsUp,
      title: "Confidence",
      desc: "We provide SLA guarantees and dedicated support so you can rest easy, knowing your environments are safe.",
    },
    {
      icon: Activity,
      title: "Innovation",
      desc: "We utilize cutting-edge AI integrations and cloud-native microservices to drive engineering metrics.",
    },
  ];

  // Trust Rating count up logic
  const countRef = useRef(null);
  const isCountInView = useInView(countRef, { once: true, margin: "-100px" });
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (isCountInView) {
      let start = 0;
      const end = 4.8;
      const duration = 1500;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setRatingCount(end);
          clearInterval(timer);
        } else {
          setRatingCount(Math.round(start * 10) / 10);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isCountInView]);

  // Feature Cards Section Data
  const featureCards = [
    {
      tag: "Get a Quote",
      title: "Project Estimation",
      desc: "Call or email for a free project timeline and technical software estimate.",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    },
    {
      tag: "Client Console",
      title: "Client Dashboard",
      desc: "Access active repository metrics, manage releases, submit feature requests, and view development stats.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    },
    {
      tag: "Security Audit",
      title: "Systems Inspection",
      desc: "What to check during performance audits, architectural reviews, and vulnerability reports.",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Accordion & Inquiry State
  const [activeFaq, setActiveFaq] = useState(0);
  const [inquiryType, setInquiryType] = useState("Cloud & DevOps");

  // Logo Mask Image Carousel State
  const [activeLogoSlide, setActiveLogoSlide] = useState(0);
  const logoCarouselImages = [
    { id: 1, src: '/carousel-1.png?v=2', label: 'Executive Suite' },
    { id: 2, src: '/carousel-2.png?v=2', label: 'Tech Team' },
    { id: 3, src: '/carousel-3.png?v=2', label: 'Modern Workstation' },
    { id: 4, src: '/carousel-4.png?v=2', label: 'Executive Boardroom' },
    { id: 5, src: '/office-bg.jpg?v=2', label: 'Office HQ' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogoSlide((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "What is covered under standard system SLAs?",
      a: "Standard SLA protection typically covers microservices downtime, server infrastructure reliability, security patch releases, and routine platform maintenance.",
    },
    {
      q: "Who maintains ownership of the custom codebase?",
      a: "You retain 100% intellectual property ownership of the codebase upon final project delivery. All source codes are transferred to your enterprise repository.",
    },
    {
      q: "How does Clarity InfoTech handle scalability audits?",
      a: "Our cloud teams conduct monthly infrastructure usage reviews to identify bottlenecks and configure auto-scaling thresholds, ensuring optimal cost-to-performance efficiency.",
    },
  ];

  // Reusable scroll animation transition presets
  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Social Links mapping with custom SVGs
  const socialLinks = [
    {
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: "https://twitter.com"
    },
    {
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: "https://linkedin.com"
    },
    {
      svg: (
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      url: "https://instagram.com"
    }
  ];

  return (
    <div className="relative min-h-screen bg-offwhite text-navy font-sans antialiased selection:bg-primary/20 selection:text-primary">

      {/* 1. NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center h-22 md:h-28 bg-gradient-to-b from-[#0A0E39]/75 via-[#0A0E39]/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full flex items-center justify-between h-full overflow-visible">
          {/* Prominently Enlarged & Ultra-Visible Logo */}
          <a href="#" className="flex items-center group h-full overflow-visible relative">
            <img
              src="/logo.png"
              alt="Clarity InfoTech Logo"
              className="w-auto h-22 sm:h-28 md:h-32 lg:h-36 object-contain transition-all duration-300 group-hover:scale-105 filter brightness-150 contrast-125 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, idx) => {
              const targetId = item === "About Us" ? "about" : item.toLowerCase().replace(/\s+/g, "");
              return (
                <a
                  key={item}
                  href={`#${targetId}`}
                  className="relative px-5 py-2 font-semibold text-sm text-white/90 hover:text-white transition-colors duration-200 z-10"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {item}
                  {hoveredIdx === idx && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 rounded-full -z-10 bg-white/15"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
              className="font-semibold text-sm text-white/90 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
              className="btn btn-pill bg-primary hover:bg-primary-hover font-semibold text-sm px-6 py-2.5 rounded-full text-white shadow-lg shadow-primary/25 transition-all duration-150 hover:-translate-y-[1px] cursor-pointer"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-white transition-colors duration-150" aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-navy/5 bg-white w-full overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-5">
                {navItems.map((item) => {
                  const targetId = item === "About Us" ? "about" : item.toLowerCase().replace(/\s+/g, "");
                  return (
                    <a
                      key={item}
                      href={`#${targetId}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-semibold text-lg text-navy/80 hover:text-primary transition-colors duration-150"
                    >
                      {item}
                    </a>
                  );
                })}
                <div className="h-[1px] bg-navy/5 my-2"></div>
                <a href="#login" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-base text-navy hover:text-primary transition-colors duration-150">Log in</a>
                <a href="#signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-pill bg-primary text-center hover:bg-primary-hover font-semibold text-base py-3 rounded-full text-white shadow-md transition-all duration-150">Sign up</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="w-full">

        {/* 2. HERO SECTION */}
        <section
          id="home"
          className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden min-h-screen flex items-center text-white"
        >
          {/* Office Background Image - LIGHTER BLUE SHADE OVERLAY */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <img
              src="/office-bg.jpg?v=3"
              alt="Clarity InfoTech Office Workspace"
              className="w-full h-full object-cover object-center"
            />
            {/* Full-width Base Vertical Gradient for smooth top & bottom blending */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0A0E39]/60 via-transparent to-[#0A0E39]/70 pointer-events-none" />
            {/* Soft Dark Smoky Scrim Gradient Fade from Right to Left for ultra-clear text legibility */}
            <div className="absolute inset-y-0 right-0 w-full md:w-4/5 bg-gradient-to-l from-[#0A0E39]/90 via-[#0A0E39]/65 to-transparent pointer-events-none" />
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 gap-12 items-center w-full relative z-10">

            {/* Left side empty space */}
            <div className="hidden md:block" />

            {/* Right Side Content - Clean Medium Impactful Text (No Box Card) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start text-left max-w-xl md:ml-auto"
            >
              <motion.h1
                variants={fadeUpVariant}
                className="font-extrabold text-3.5xl sm:text-4.5xl lg:text-5xl leading-[1.12] tracking-tight text-white mb-6 drop-shadow-xl font-sans"
              >
                Powering Your <br />Technology Like It's <br />
                <span className="text-sky-400 relative inline-flex items-center gap-3 font-black">
                  Our Own
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-sky-500/25 p-2.5 backdrop-blur-md border border-sky-400/50 shadow-lg">
                    <Cloud className="text-sky-300 w-full h-full" />
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUpVariant}
                className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed font-normal drop-shadow-md max-w-xl font-sans"
              >
                Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, and security audit systems. We align our processes with your vision to secure your production environments.
              </motion.p>

              <motion.div
                variants={fadeUpVariant}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                className="inline-block"
              >
                <a href="#services" className="group btn bg-primary hover:bg-primary-hover text-white font-semibold text-base px-8 py-4 rounded-full shadow-xl shadow-primary/50 flex items-center gap-3 transition-all duration-200 font-sans">
                  Explore IT Solutions
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </span>
                </a>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* 2. ABOUT US SECTION (Shifted Up with Larger Typography & Animations) */}
        <section id="about" className="pt-16 md:pt-20 pb-20 md:pb-28 bg-white relative overflow-hidden text-left z-20">
          {/* Left Side Large Background Circle Curve with Scale Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="absolute -left-40 sm:-left-60 top-1/2 -translate-y-1/2 w-[480px] h-[480px] sm:w-[640px] sm:h-[640px] rounded-full bg-gradient-to-br from-primary/10 via-blue-400/5 to-transparent border border-primary/10 pointer-events-none -z-0"
          />

          {/* Right Side Decorative Graphic Arc & Orbs matching Image 1 & 2 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full border border-primary/20 pointer-events-none hidden lg:flex items-center justify-center translate-x-1/4">
            {/* Inner soft blur circle */}
            <div className="w-72 h-72 sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-br from-primary/10 via-blue-400/5 to-transparent blur-2xl" />

            {/* Small Top Floating Accent Dot */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-8 w-5 h-5 rounded-full bg-primary/70 shadow-md shadow-primary/30"
            />

            {/* Large 3D Floating Sphere Orb matching Image 1 & Image 2 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-16 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary via-indigo-600 to-[#0A0E39] shadow-2xl shadow-primary/50 border border-white/20"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

            {/* Left Column (6 cols): Text & Stats Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.15 } }
              }}
              className="lg:col-span-6 flex flex-col justify-center items-start text-left my-auto relative z-10"
            >
              {/* Subtitle Badge with accent line */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                }}
                className="flex items-center gap-3 text-primary font-extrabold text-sm sm:text-base uppercase tracking-widest mb-4 font-sans"
              >
                <span className="w-8 h-[2.5px] bg-primary inline-block rounded-full" />
                ABOUT US
              </motion.div>

              {/* Main Headline */}
              <motion.h2
                variants={{
                  hidden: { opacity: 0, x: -35, y: 15 },
                  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="font-extrabold text-2.5xl sm:text-3.5xl lg:text-4xl leading-[1.18] tracking-tight mb-5 font-sans"
              >
                <span className="text-navy block">We are the best</span>
                <span className="text-primary block">in IT &amp; Software Solutions</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, x: -35, y: 15 },
                  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="text-sm sm:text-base text-navy/70 leading-relaxed mb-7 max-w-xl font-normal font-sans"
              >
                Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, cloud architecture, and security audit systems. We align our processes with your vision to secure your production environments with 24/7 reliability.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-navy/10 w-full max-w-xl"
              >
                <div>
                  <span className="font-black text-2.5xl sm:text-3xl text-navy block tracking-tight mb-1 font-sans">3485+</span>
                  <span className="text-xs sm:text-sm text-navy/60 font-semibold font-sans">Projects Done</span>
                </div>
                <div>
                  <span className="font-black text-2.5xl sm:text-3xl text-navy block tracking-tight mb-1 font-sans">426+</span>
                  <span className="text-xs sm:text-sm text-navy/60 font-semibold font-sans">Clients</span>
                </div>
                <div>
                  <span className="font-black text-2.5xl sm:text-3xl text-navy block tracking-tight mb-1 font-sans">281+</span>
                  <span className="text-xs sm:text-sm text-navy/60 font-semibold font-sans">Running Projects</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column (6 cols): 3 Staggered Cards */}
            <div className="lg:col-span-6 relative">
              {/* Stacked Cards Container */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } }
                }}
                className="relative z-10 flex flex-col gap-6 max-w-md mx-auto lg:ml-auto lg:mr-0"
              >
                {/* Card 1 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 45, y: 20 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-navy/5 border border-navy/5 transition-all duration-300 ml-0"
                >
                  <span className="absolute -top-4 left-5 text-4xl sm:text-5xl font-black text-navy/15 select-none font-sans">
                    1
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-navy mb-1.5 font-sans">Security</h3>
                      <p className="text-navy/60 text-sm leading-relaxed font-normal font-sans">
                        To us protection is not just important, it's a necessity. Guarantee your infrastructure's uptime.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2 (Staggered to the Right) */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 45, y: 20 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-navy/5 border border-navy/5 transition-all duration-300 ml-4 sm:ml-12"
                >
                  <span className="absolute -top-4 left-5 text-4xl sm:text-5xl font-black text-navy/15 select-none font-sans">
                    2
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ThumbsUp size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-navy mb-1.5 font-sans">Confidence</h3>
                      <p className="text-navy/60 text-sm leading-relaxed font-normal font-sans">
                        We provide SLA guarantees and dedicated support so you can rest easy, knowing your environments are safe.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 45, y: 20 },
                    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-navy/5 border border-navy/5 transition-all duration-300 ml-0 sm:ml-2"
                >
                  <span className="absolute -top-4 left-5 text-4xl sm:text-5xl font-black text-navy/15 select-none font-sans">
                    3
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-navy mb-1.5 font-sans">Innovation</h3>
                      <p className="text-navy/60 text-sm leading-relaxed font-normal font-sans">
                        We utilize cutting-edge AI integrations and cloud-native microservices to drive engineering metrics.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ==========================================
            3. SOLUTIONS SECTION (Black Section)
            ========================================== */}
        <section
          id="solutions"
          className="bg-black text-white py-16 md:py-24 w-full border-t border-white/10 overflow-x-hidden relative text-left"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">

              {/* Left Column (7 cols) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
                }}
                className="lg:col-span-7 flex flex-col justify-start"
              >
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-6 leading-[1.15] text-white font-sans max-w-full">
                  <Typewriter text="Powering Platforms" delay={0} speed={0.012} />
                  <br />
                  <Typewriter text="that " delay={0.25} speed={0.012} />
                  <span className="font-dm-serif italic font-normal text-white">
                    <Typewriter text="Scale Your Business" delay={0.35} speed={0.012} />
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-white/50 leading-relaxed font-light max-w-xl whitespace-normal mb-12 font-sans">
                  <Typewriter
                    text="For over a decade, the region's most demanding corporate enterprises have relied on our custom cloud infrastructures and skilled engineering squads to deploy code efficiently and reduce system downtime."
                    delay={0.1}
                    speed={0.012}
                  />
                </p>

                {/* Stats Grid */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-8"
                >
                  {/* Stat 1 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className="flex flex-col"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif tracking-tight mb-2 text-white">
                      <AnimatedCounter value={500} suffix="K+" />
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Deployments Automated Daily
                    </span>
                  </motion.div>

                  {/* Stat 2 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className="flex flex-col"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif tracking-tight mb-2 text-white">
                      <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Production Uptime Maintained
                    </span>
                  </motion.div>

                  {/* Stat 3 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className="flex flex-col"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif tracking-tight mb-2 text-white">
                      <AnimatedCounter value={50} suffix="+" />
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Cloud Clusters Configured
                    </span>
                  </motion.div>

                  {/* Stat 4 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className="flex flex-col"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif tracking-tight mb-2 text-white">
                      <AnimatedCounter value={15} suffix="+" />
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider">
                      DevOps Frameworks Supported
                    </span>
                  </motion.div>

                  {/* Stat 5 */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className="flex flex-col col-span-2 sm:col-span-1"
                  >
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-dm-serif tracking-tight mb-2 text-white">
                      <AnimatedCounter value={24} suffix="/7" />
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-wider">
                      System Support & Monitoring
                    </span>
                  </motion.div>

                </motion.div>
              </motion.div>

              {/* Right Column: 3-Layer Concentric 'C' Logo Masked Image Carousel + Controls */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
                  className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] aspect-square origin-center overflow-hidden"
                  style={{
                    filter: "drop-shadow(0 0 25px rgba(79, 70, 229, 0.45)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.25))"
                  }}
                >
                  {/* Layer 1: Outer Ring (Opacity: 0.70) */}
                  <div
                    className="absolute inset-0 w-full h-full opacity-70"
                    style={{
                      WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 81.82 18.18 A 45 45 0 1 0 81.82 81.82 A 6 6 0 0 0 73.33 73.33 A 33 33 0 1 1 73.33 26.67 A 6 6 0 0 0 81.82 18.18 Z'/%3E%3C/svg%3E")`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 81.82 18.18 A 45 45 0 1 0 81.82 81.82 A 6 6 0 0 0 73.33 73.33 A 33 33 0 1 1 73.33 26.67 A 6 6 0 0 0 81.82 18.18 Z'/%3E%3C/svg%3E")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeLogoSlide}
                        src={logoCarouselImages[activeLogoSlide].src}
                        alt={logoCarouselImages[activeLogoSlide].label}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover object-center"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Layer 2: Middle Ring (Opacity: 0.90) */}
                  <div
                    className="absolute inset-0 w-full h-full opacity-90"
                    style={{
                      WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 71.92 28.08 A 31 31 0 1 0 71.92 71.92 A 5 5 0 0 0 64.85 64.85 A 21 21 0 1 1 64.85 35.15 A 5 5 0 0 0 71.92 28.08 Z'/%3E%3C/svg%3E")`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 71.92 28.08 A 31 31 0 1 0 71.92 71.92 A 5 5 0 0 0 64.85 64.85 A 21 21 0 1 1 64.85 35.15 A 5 5 0 0 0 71.92 28.08 Z'/%3E%3C/svg%3E")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeLogoSlide}
                        src={logoCarouselImages[activeLogoSlide].src}
                        alt={logoCarouselImages[activeLogoSlide].label}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover object-center"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Layer 3: Inner Ring (Opacity: 1.0 - Brightest core) */}
                  <div
                    className="absolute inset-0 w-full h-full opacity-100"
                    style={{
                      WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 63.44 36.56 A 19 19 0 1 0 63.44 63.44 A 5 5 0 0 0 56.36 56.36 A 9 9 0 1 1 56.36 43.64 A 5 5 0 0 0 63.44 36.56 Z'/%3E%3C/svg%3E")`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 63.44 36.56 A 19 19 0 1 0 63.44 63.44 A 5 5 0 0 0 56.36 56.36 A 9 9 0 1 1 56.36 43.64 A 5 5 0 0 0 63.44 36.56 Z'/%3E%3C/svg%3E")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeLogoSlide}
                        src={logoCarouselImages[activeLogoSlide].src}
                        alt={logoCarouselImages[activeLogoSlide].label}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover object-center"
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Thumbnails Row matching Image 1 under the Logo */}
                <div className="mt-6 flex flex-col items-center gap-3.5">
                  <div className="flex items-center gap-2 sm:gap-2.5 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    {logoCarouselImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveLogoSlide(idx)}
                        className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          activeLogoSlide === idx
                            ? "border-primary scale-110 shadow-lg shadow-primary/50 ring-2 ring-primary/40"
                            : "border-white/20 opacity-50 hover:opacity-100 hover:border-white/60"
                        }`}
                        title={img.label}
                      >
                        <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Carousel Indicator Dots / Bars matching Image 1 */}
                  <div className="flex items-center gap-1.5">
                    {logoCarouselImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveLogoSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeLogoSlide === idx ? "w-6 bg-primary shadow-md shadow-primary/50" : "w-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 5. PROJECTS / CASE STUDIES SECTION (SERVICES PAGE UI) */}
        <section
          id="services"
          ref={servicesRef}
          className="relative bg-white text-black overflow-hidden border-t border-b border-black/10"
        >
          <style>{`
            @keyframes marqueeProjects {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .marquee-projects {
              animation: marqueeProjects 28s linear infinite;
            }
            .marquee-projects:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Top Area (Header with floating squares) */}
          <div className="relative px-6 pb-8 pt-12 sm:pt-16 lg:pt-20">
            {/* Parallax Floating Black Squares Layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {headerSquares.map((sq, idx) => (
                <ParallaxFloatingSquare key={idx} sq={sq} index={idx} targetRef={servicesRef} />
              ))}
            </div>

            {/* Header Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-4xl text-center"
            >
              <span className="mb-6 inline-block bg-primary/10 text-primary border border-primary/30 px-6 py-2.5 text-sm sm:text-base font-bold tracking-wide rounded-full shadow-md shadow-primary/10 font-sans">
                Our Services
              </span>
              <h2 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-[1.25] tracking-tight font-sans mb-4">
                <span className="text-primary font-medium">Empowering Technology through </span>
                <span className="text-black/40">Our</span>
                <br />
                <span className="text-black/40">Services</span>
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-black/60 font-normal leading-relaxed font-sans">
                Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, cloud-native security, and dedicated IT consulting for modern digital transformations.
              </p>
            </motion.div>
          </div>

          {/* Case Study Cards (2x2 grid) */}
          <div className="mx-auto max-w-5xl px-6 pb-14 sm:px-8 lg:px-12">
            <div className="grid gap-4 md:grid-cols-2">
              {caseStudiesData.map((card, idx) => (
                <CaseStudyCardItem key={card.id} card={card} index={idx} />
              ))}
            </div>
          </div>

          {/* Footer Area */}
          <div className="mx-auto max-w-7xl px-6 pb-6 sm:px-10 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              {/* Left side */}
              <div className="max-w-md text-left">
                <div className="mb-4 flex h-7 w-7 items-center justify-center border border-black/20 text-xs text-black font-sans">
                  +
                </div>
                <p className="text-[14px] leading-[1.7] text-black/60 font-sans">
                  We partner with ambitious brands that are ready to move beyond fragmented visuals and shallow quick fixes -- turning their identity, website, and messaging into one focused engine for growth.
                </p>
                <div className="mt-6">
                  <button type="button" className="group flex items-end cursor-pointer border-none bg-transparent p-0">
                    <span className="inline-flex items-center gap-[10px] border border-black/20 bg-black px-3 py-2 text-base font-medium text-white group-hover:bg-black/85 transition-colors font-sans">
                      Let's work together
                    </span>
                    <span className="mb-6 group-hover:mb-9 flex h-6 w-6 items-center justify-center bg-black transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" fill="currentColor"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Right side infinite marquee */}
              <div className="flex-1 overflow-hidden md:ml-12 border-t border-black/10 md:border-t-0 pt-6 md:pt-0">
                <div className="overflow-hidden py-5">
                  <div className="marquee-projects flex w-max">
                    {[...marqueeLogos, ...marqueeLogos].map((logo, idx) => (
                      <div key={idx} className="flex shrink-0 items-center gap-2.5 px-8">
                        <span className="text-black">{logo.icon}</span>
                        <span className="whitespace-nowrap text-sm font-medium tracking-wide text-black/80 font-sans">{logo.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacer */}
          <div className="h-12" />
        </section>

        {/* 6. FAQ & "TELL US WHAT YOU NEED" SPLIT SECTION */}
        <section id="contact" className="relative py-20 md:py-28 bg-[#151b2e] text-white overflow-hidden">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <img
              src="/office-bg.jpg?v=3"
              alt="Office Architecture"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1631]/95 via-[#0F1631]/90 to-[#0F1631]/80" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">

            {/* Left Side: "You Have Questions, We Have Answers" Title & FAQ Accordion (7 cols) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={fadeUpVariant}
              className="lg:col-span-7 flex flex-col justify-start text-left"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-semibold tracking-tight text-white mb-3 font-sans leading-[1.2]">
                You Have Questions,<br />
                <span className="text-white/80 font-normal">We Have Answers</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-lg mb-6 font-sans font-light">
                Discover clear answers to common enterprise software, cloud infrastructure, and security availability questions.
              </p>

              {/* FAQ Accordion List (NO location, NO social media, NO email, NO contact) */}
              <div className="flex flex-col gap-3 w-full max-w-lg">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${
                      activeFaq === idx ? "bg-white/10 border-white/30 shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between px-4 py-3 sm:py-3.5 text-left font-medium text-xs sm:text-sm text-white cursor-pointer"
                    >
                      <span className="pr-3">{faq.q}</span>
                      <motion.span
                        animate={shouldReduceMotion ? {} : { rotate: activeFaq === idx ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-base font-bold flex-shrink-0 ${activeFaq === idx ? "text-primary" : "text-white/50"}`}
                      >
                        {activeFaq === idx ? "−" : "+"}
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-xs sm:text-[13px] text-white/70 leading-relaxed border-t border-white/10 pt-2.5 font-light">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Floating White "Tell Us What You Need" Form Card (5 cols) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={fadeUpVariant}
              className="lg:col-span-5 bg-white text-navy rounded-2xl p-5 sm:p-6 shadow-xl text-left border border-white/20"
            >
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-navy mb-1 font-sans">
                Tell Us What You Need
              </h3>
              <p className="text-xs text-navy/55 leading-relaxed mb-4 font-sans">
                Our team is ready to assist you with every detail, big or small.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); alert("Inquiry submitted successfully! Our team will contact you shortly."); }} className="flex flex-col gap-2.5">
                {/* 2-Col Grid: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    className="w-full bg-[#f8fafc] border border-navy/15 px-3.5 py-2 rounded-full text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    className="w-full bg-[#f8fafc] border border-navy/15 px-3.5 py-2 rounded-full text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>

                {/* 2-Col Grid: Country & Phone Number */}
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full bg-[#f8fafc] border border-navy/15 px-3.5 py-2 rounded-full text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-[#f8fafc] border border-navy/15 px-3.5 py-2 rounded-full text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans"
                  />
                </div>

                {/* Email Address */}
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-[#f8fafc] border border-navy/15 px-3.5 py-2 rounded-full text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans"
                />

                {/* Type of Inquiry Selectable Pills */}
                <div className="mt-0.5">
                  <label className="block text-[11px] font-semibold text-navy/60 mb-1.5 font-sans">Type of Inquiry</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Cloud & DevOps", "Software Dev", "Cyber Security", "AI Consulting", "Others"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setInquiryType(item)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                          inquiryType === item
                            ? "bg-navy text-white shadow-sm"
                            : "bg-[#f8fafc] text-navy/70 border border-navy/10 hover:border-navy/30"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <textarea
                  rows={2.5}
                  placeholder="Message"
                  required
                  className="w-full bg-[#f8fafc] border border-navy/15 p-3 rounded-xl text-xs text-navy placeholder-navy/40 focus:outline-none focus:border-primary transition-colors font-sans resize-none mt-0.5"
                ></textarea>

                {/* Checkbox */}
                <div className="flex items-center gap-2 my-0.5">
                  <input
                    type="checkbox"
                    id="techUpdatesCheck"
                    className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                  />
                  <label htmlFor="techUpdatesCheck" className="text-[10.5px] sm:text-[11px] text-navy/60 cursor-pointer font-sans">
                    I'd like to receive exclusive tech updates and insights
                  </label>
                </div>

                {/* Rounded Full Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-navy hover:bg-primary text-white font-semibold py-2.5 rounded-full transition-all duration-300 shadow-md shadow-navy/10 text-xs sm:text-sm font-sans cursor-pointer mt-0.5"
                >
                  Submit
                </button>
              </form>
            </motion.div>

          </div>
        </section>

      </main>

      {/* 7. KRESNA SAAS FOOTER SECTION UI WITH CLARITY INFOTECH CONTENT */}
      <section className="footer-section bg-white py-12 px-6 overflow-hidden text-left relative">
        <style>{`
          .footer-wrapper {
            max-width: 1150px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 16px;
            align-items: stretch;
            position: relative;
            z-index: 10;
          }
          .footer-left {
            position: relative;
            min-height: 340px;
            border-radius: 28px;
            padding: 32px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(21, 76, 189, 0.25);
            background: #1e4fc0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .footer-left-video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
            pointer-events: none;
          }
          .footer-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
            z-index: 1;
          }
          .footer-logo-mark {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.15);
            border: 1.5px solid rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
          }
          .footer-logo-name {
            font-family: 'DM Sans', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
          }
          .footer-tagline-container {
            margin-top: auto;
            margin-bottom: 28px;
            position: relative;
            z-index: 1;
          }
          .footer-tagline {
            font-family: 'DM Sans', sans-serif;
            font-size: 19px;
            font-weight: 400;
            color: #ffffff;
            line-height: 1.45;
          }
          .footer-tagline span {
            color: rgba(255, 255, 255, 0.65);
          }
          .footer-social-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
          }
          .footer-social-label {
            font-family: 'Caveat', cursive;
            font-size: 17px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            letter-spacing: 0.3px;
          }
          .footer-social-icons {
            display: flex;
            gap: 7px;
          }
          .social-icon {
            width: 36px;
            height: 36px;
            border-radius: 9px;
            background: #0e1014;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 18px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2);
            transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
            cursor: pointer;
          }
          .social-icon:hover {
            background: #000000;
            transform: translateY(-2px);
            box-shadow: 0 10px 24px rgba(0,0,0,0.45);
          }
          .footer-right {
            background: #f0f1f5;
            border-radius: 28px;
            padding: 40px;
            overflow: visible;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }
          .footer-lucky-graphic {
            position: absolute;
            top: -36px;
            right: 40px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .lucky-cube {
            width: 96px;
            height: 96px;
            border-radius: 22px;
            transform: rotate(-10deg);
            background: linear-gradient(135deg, #5b9ffb 0%, #1e5dd7 55%, #1448be 100%);
            box-shadow: inset 3px 3px 8px rgba(255,255,255,0.35), inset -3px -3px 12px rgba(0,0,0,0.18), 8px 14px 28px rgba(20,72,200,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .lucky-cube-mark {
            font-family: 'DM Sans', sans-serif;
            font-size: 42px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.04em;
            transform: rotate(10deg);
            text-shadow: 0 3px 6px rgba(0,0,0,0.25);
            line-height: 1;
          }
          .lucky-text-row {
            display: flex;
            gap: 6px;
            align-items: center;
            transform: rotate(-4deg);
            margin-top: 4px;
          }
          .lucky-arrow {
            width: 22px;
            height: 22px;
            color: #9ca3af;
          }
          .lucky-text {
            font-family: 'Caveat', cursive;
            font-size: 20px;
            font-weight: 600;
            color: #9ca3af;
            white-space: nowrap;
          }
          .footer-right-top {
            display: flex;
            gap: 72px;
            padding-top: 8px;
          }
          .footer-col-title {
            font-family: 'Caveat', cursive;
            font-size: 24px;
            font-weight: 600;
            font-style: italic;
            color: #9ca3af;
            margin-bottom: 18px;
          }
          .footer-col a {
            display: block;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 14px;
            text-decoration: none;
            transition: color 0.2s;
          }
          .footer-col a:hover {
            color: #1f65d6;
          }
          .footer-bottom {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-top: 48px;
          }
          .footer-copyright {
            font-family: 'DM Sans', sans-serif;
            font-size: 12.5px;
            font-weight: 500;
            color: #9ca3af;
          }
          .footer-cta-mini {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .footer-cta-mini h4 {
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            font-weight: 400;
            color: #6b7280;
            line-height: 1.45;
          }
          .footer-cta-mini h4 strong {
            display: block;
            font-size: 19px;
            font-weight: 700;
            color: #111827;
          }
          .footer-subscribe-row {
            width: 310px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            display: flex;
          }
          .footer-subscribe-row input {
            flex: 1;
            padding: 11px 14px;
            background: transparent;
            border: none;
            outline: none;
            font-family: 'DM Sans', sans-serif;
            font-size: 13.5px;
            color: #111827;
          }
          .footer-subscribe-row input::placeholder {
            color: #9ca3af;
          }
          .footer-subscribe-row button {
            padding: 11px 22px;
            background: #111214;
            color: #ffffff;
            font-family: 'DM Sans', sans-serif;
            font-size: 13.5px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            box-shadow: 0 6px 20px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          }
          .footer-subscribe-row button:hover {
            background: #000000;
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.35);
          }
          .footer-watermark {
            max-width: 720px;
            margin: -20px auto 0;
            pointer-events: none;
            user-select: none;
            position: relative;
            z-index: 0;
            line-height: 0;
            opacity: 0.75;
          }
          .footer-watermark svg {
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .footer-watermark text {
            font-family: 'DM Sans', sans-serif;
            font-weight: 700;
            letter-spacing: -0.03em;
            fill: rgba(0, 0, 0, 0.04);
          }
          @media (max-width: 860px) {
            .footer-wrapper {
              grid-template-columns: 1fr;
            }
            .footer-left {
              min-height: auto;
              gap: 40px;
            }
          }
          @media (max-width: 560px) {
            .footer-right {
              padding: 24px;
            }
            .footer-nav-cols {
              gap: 40px;
            }
            .footer-bottom {
              flex-direction: column;
              align-items: flex-start;
              gap: 24px;
            }
            .footer-subscribe-row {
              width: 100%;
            }
            .footer-lucky-graphic {
              right: 12px;
              top: -28px;
            }
            .lucky-cube {
              width: 72px;
              height: 72px;
            }
          }
        `}</style>

        <div className="footer-wrapper">
          {/* Left Card */}
          <div className="footer-left">
            <video className="footer-left-video" autoPlay muted loop playsInline preload="auto">
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4" type="video/mp4" />
            </video>

            <div className="footer-logo">
              <div className="footer-logo-mark">
                C
              </div>
              <span className="footer-logo-name">Clarity InfoTech</span>
            </div>

            <div className="footer-tagline-container">
              <div className="footer-tagline">
                Smarter IT solutions,<br />
                <span>powered by enterprise AI.</span>
              </div>
            </div>

            <div className="footer-social-row">
              <span className="footer-social-label">Stay in touch!</span>
              <div className="footer-social-icons">
                {/* Discord */}
                <a href="#" className="social-icon" aria-label="Discord">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="social-icon" aria-label="X">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                {/* GitHub */}
                <a href="#" className="social-icon" aria-label="GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="footer-right">
            {/* Floating Lucky Graphic */}
            <div className="footer-lucky-graphic">
              <div className="lucky-cube">
                <span className="lucky-cube-mark">C</span>
              </div>
              <div className="lucky-text-row">
                <svg className="lucky-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 20 C 6 14, 10 9, 18 5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 5 L 12 5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 5 L 18 11" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="lucky-text">Feeling lucky?</span>
              </div>
            </div>

            {/* Top Navigation Cols */}
            <div className="footer-right-top">
              <div className="footer-nav-cols flex gap-16 md:gap-24">
                <div className="footer-col">
                  <div className="footer-col-title">Navigation</div>
                  <a href="#home">Home</a>
                  <a href="#about">About Us</a>
                  <a href="#services">Services</a>
                  <a href="#stats">Solutions</a>
                  <a href="#testimonials">Testimonials</a>
                  <a href="#faq">FAQ</a>
                </div>
                <div className="footer-col">
                  <div className="footer-col-title">Company</div>
                  <a href="#services">AWS &amp; GCP Partner</a>
                  <a href="#about">ISO 27001 Security</a>
                  <a href="#services">DevOps Association</a>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Condition</a>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="footer-bottom">
              <div className="footer-copyright">
                © 2026 Clarity InfoTech / Rain Corraya. All rights reserved.
              </div>

              <div className="footer-cta-mini">
                <h4>
                  Enterprise tech moves fast.<br />
                  <strong>Stay ahead with Clarity.</strong>
                </h4>

                <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="footer-subscribe-row">
                  <input type="email" placeholder="Enter email address" required />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark SVG */}
        <div className="footer-watermark" aria-hidden="true">
          <svg id="watermarkSvg" viewBox="62 95 876 175" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <text id="watermarkText" x="500" y="240" textAnchor="middle" fontSize="210">Clarity</text>
          </svg>
        </div>
      </section>

      {/* Login / Signup Modal with 3D Rotating Network Globe */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

    </div>
  );
}
