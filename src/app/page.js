"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
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
  MapPin,
  Cloud,
  Lock
} from "lucide-react";

// Reusable Typewriter Component (Scroll-triggered Character Reveal)
function Typewriter({ text, delay = 0, speed = 0.015, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

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
  const inView = useInView(ref, { once: true, margin: "-50px" });

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

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Navbar Items
  const navItems = ["Home", "Services", "Stats", "Solutions", "Testimonials", "Contact"];

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

  // Accordion State
  const [activeFaq, setActiveFaq] = useState(0);

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
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center h-22 md:h-28 bg-gradient-to-b from-[#0A0E39]/95 via-[#0A0E39]/60 to-transparent">
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
            {navItems.map((item, idx) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
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
            ))}
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#login" className="font-semibold text-sm text-white/90 hover:text-white transition-colors duration-150">Log in</a>
            <a href="#signup" className="btn btn-pill bg-primary hover:bg-primary-hover font-semibold text-sm px-6 py-2.5 rounded-full text-white shadow-lg shadow-primary/25 transition-all duration-150 hover:-translate-y-[1px]">Sign up</a>
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
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold text-lg text-navy/80 hover:text-primary transition-colors duration-150"
                  >
                    {item}
                  </a>
                ))}
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
          className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden min-h-[90vh] flex items-center text-white"
        >
          {/* Office Background Image - EXACT uploaded image with Smooth Gradual Smoky Merge */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <img
              src="/office-bg.jpg"
              alt="Clarity InfoTech Office Workspace"
              className="w-full h-full object-cover object-center"
            />
            {/* Soft Gradual Smoky Gradient Merge into Image */}
            <div className="absolute inset-x-0 top-0 h-48 md:h-64 bg-gradient-to-b from-[#0A0E39]/90 via-[#0A0E39]/40 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 gap-12 items-center w-full relative z-10">

            {/* Left side empty space to keep neon plant wall & team space unobstructed */}
            <div className="hidden md:block" />

            {/* Right Side Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start text-left max-w-xl md:ml-auto"
            >
              <motion.h1
                variants={fadeUpVariant}
                className="font-extrabold text-4.5xl sm:text-5xl lg:text-6.5xl leading-[1.08] tracking-tight text-white mb-6 drop-shadow-md"
              >
                Powering Your <br />Technology Like It's <br />
                <span className="text-primary relative inline-flex items-center gap-3">
                  Our Own
                  <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-white/10 p-2.5 backdrop-blur-sm border border-white/10">
                    <Cloud className="text-white w-full h-full" />
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUpVariant}
                className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed font-light drop-shadow-sm max-w-xl"
              >
                Clarity InfoTech delivers enterprise-grade software engineering, DevOps automation, and security audit systems. We align our processes with your vision to secure your production environments.
              </motion.p>

              <motion.div
                variants={fadeUpVariant}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                className="inline-block"
              >
                <a href="#solutions" className="group btn bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-4 rounded-full shadow-xl shadow-primary/30 flex items-center gap-3 transition-all duration-200">
                  Explore IT Solutions
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRight size={20} />
                  </span>
                </a>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* 3. TRUST ROW */}
        <section id="services" className="py-16 bg-lightgray/60 border-t border-b border-navy/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              {trustCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUpVariant}
                    whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
                    className="bg-white border border-navy/5 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start"
                  >
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { rotate: 12, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"
                    >
                      <IconComponent size={24} />
                    </motion.div>
                    <h3 className="font-extrabold text-xl mb-3 text-navy">{card.title}</h3>
                    <p className="text-navy/70 text-sm leading-relaxed">{card.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ==========================================
            STATS & CASE STUDY
            ========================================== */}
        <section
          id="stats"
          className="bg-black text-white py-16 md:py-24 w-full border-t border-white/10 overflow-x-hidden relative text-left"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">

              {/* Left Column (7 cols) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
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

              {/* Right Column: 3-Layer Concentric 'C' Logo Masked Video (5 cols) */}
              <div
                className="lg:col-span-5 flex justify-center lg:justify-end items-center overflow-hidden"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(79, 70, 229, 0.45)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.25))"
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
                  className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] aspect-square origin-center overflow-hidden"
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
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/logo video.mp4" type="video/mp4" />
                    </video>
                  </div>

                  {/* Layer 2: Middle Ring (Opacity: 0.88) */}
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
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/logo video.mp4" type="video/mp4" />
                    </video>
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
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/logo video.mp4" type="video/mp4" />
                    </video>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. TRUST BY US SPLIT SECTION */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 gap-16 items-center">

            {/* Left Column: Heading, ratings */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="flex flex-col items-start text-left"
            >
              <div className="decorative-logo-bg opacity-10 mb-4 text-primary">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="currentColor" />
                </svg>
              </div>

              <h2 className="font-extrabold text-4xl sm:text-5xl leading-tight mb-8">
                Many Companies <br />
                <span className="text-primary">Trust By Us.</span>
              </h2>

              <div ref={countRef} className="flex items-center gap-6 bg-offwhite border border-navy/5 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col">
                  <span className="font-extrabold text-5xl text-navy tracking-tight">{ratingCount.toFixed(1)}</span>
                  <div className="flex items-center gap-1 text-accent-yellow mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" className="text-yellow-500" />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-[1px] bg-navy/10"></div>
                <div className="flex flex-col">
                  <div className="flex -space-x-3 mb-1">
                    <motion.img
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt=""
                    />
                    <motion.img
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      alt=""
                    />
                    <motion.img
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                      alt=""
                    />
                  </div>
                  <span className="text-sm font-semibold text-navy/70">(10k+ Reviews)</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Paragraph, actions, certs */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col items-start text-left"
            >
              <motion.p variants={fadeUpVariant} className="text-base text-navy/70 leading-relaxed mb-8">
                We design and support secure system infrastructures across modern corporate environments. Our consultants integrate scalable CI/CD automation pipelines, execute load audits, and establish data recovery protocols to align with global security frameworks.
              </motion.p>

              <motion.div variants={fadeUpVariant} className="flex items-center gap-6 mb-8 w-full sm:w-auto">
                <a href="#quote" className="btn btn-primary bg-primary hover:bg-primary-hover font-semibold px-6 py-3 rounded-full text-white shadow-md shadow-primary/10 transition-all duration-150">Free IT Consultation</a>
                <a href="#contact" className="group btn-link font-semibold text-navy hover:text-primary transition-smooth flex items-center gap-2">
                  Contact Us
                  <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                </a>
              </motion.div>

              <motion.div
                variants={fadeUpVariant}
                className="grid sm:grid-cols-2 gap-4 w-full"
              >
                {/* Cloud Architect Cert */}
                <motion.div
                  whileHover={{ y: shouldReduceMotion ? 0 : -4, boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.06)" }}
                  className="flex items-center gap-4 bg-offwhite border border-navy/5 p-4 rounded-xl shadow-sm transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Cloud size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-navy">Cloud Architect</span>
                    <span className="text-[11px] text-navy/50 leading-tight">Certified AWS & GCP Partners</span>
                  </div>
                </motion.div>

                {/* ISO Cert */}
                <motion.div
                  whileHover={{ y: shouldReduceMotion ? 0 : -4, boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.06)" }}
                  className="flex items-center gap-4 bg-offwhite border border-navy/5 p-4 rounded-xl shadow-sm transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Lock size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-navy">ISO 27001</span>
                    <span className="text-[11px] text-navy/50 leading-tight">Information Security Standard</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* 5. FEATURE CARDS */}
        <section id="solutions" className="py-20 bg-lightgray/60 border-t border-b border-navy/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="font-extrabold text-4xl mb-4"
              >
                Build, Protect & <span className="text-primary">Stay Ahead</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-navy/70 text-base"
              >
                From structural analysis to daily deployments, our consulting pipelines deliver reliable code releases for corporate projects.
              </motion.p>
            </div>

            {/* Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              {featureCards.map((card, idx) => (
                <motion.article
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: shouldReduceMotion ? 1 : 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                  whileHover={{ y: shouldReduceMotion ? 0 : -6 }}
                  className="group bg-white rounded-3xl border border-navy/5 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Card Image */}
                  <div className="h-[220px] overflow-hidden relative bg-navy/5">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Badge Pill with scale pulse */}
                    <motion.span
                      animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute top-5 left-5 bg-white text-navy font-bold text-xs px-4 py-2 rounded-full shadow-md z-10"
                    >
                      {card.tag}
                    </motion.span>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 text-left">
                    <h3 className="font-extrabold text-xl mb-3 text-navy">{card.title}</h3>
                    <p className="text-navy/70 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>

          </div>
        </section>

        {/* 6. FAQ + NEWSLETTER SPLIT SECTION */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Side: White Accordion FAQ Card (7 cols) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="md:col-span-7 bg-white border border-navy/5 shadow-lg rounded-3xl p-6 sm:p-10 flex flex-col items-stretch text-left"
            >
              <h3 className="font-extrabold text-2xl text-navy mb-2">IT Service FAQs</h3>
              <p className="text-sm text-navy/55 mb-8">Clear answers to common enterprise software and service availability questions.</p>

              <div className="flex flex-col gap-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl transition-all duration-300 ${activeFaq === idx ? "border-primary" : "border-navy/5"}`}
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-base text-navy"
                    >
                      <span>{faq.q}</span>
                      <motion.span
                        animate={shouldReduceMotion ? {} : { rotate: activeFaq === idx ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-lg font-bold ${activeFaq === idx ? "text-primary" : "text-navy/40"}`}
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
                          <p className="px-5 pb-5 text-sm text-navy/70 leading-relaxed border-t border-navy/5 pt-3 bg-offwhite/50">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Indigo Newsletter Card (5 cols) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="md:col-span-5 bg-primary text-white shadow-xl rounded-3xl p-8 sm:p-10 text-left flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="font-extrabold text-2xl mb-3">Stay Updated</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8">Subscribe to our newsletter to receive corporate engineering updates and tech roadmaps.</p>

                <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="flex flex-col gap-4 mb-8">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-white/10 text-white placeholder-white/50 border border-white/15 px-5 py-3.5 pl-11 rounded-full text-sm glow-focus transition-smooth font-semibold focus:bg-white focus:text-navy focus:placeholder-navy/35"
                    />
                  </div>

                  {/* Button with slide-in sweep overlay */}
                  <button
                    type="submit"
                    className="relative overflow-hidden group w-full bg-navy text-white font-bold py-4 rounded-full transition-all duration-300 hover:shadow-lg shadow-navy/20"
                  >
                    <span className="absolute inset-0 w-full h-full bg-primary/15 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">Subscribe</span>
                  </button>
                </form>
              </div>

              <div className="border-t border-white/15 pt-6 flex flex-col gap-1">
                <span className="text-xs text-white/60 font-semibold">Support Contact:</span>
                <a href="mailto:support@clarityinfotech.com" className="text-sm font-semibold hover:text-white/80 underline decoration-white/30">support@clarityinfotech.com</a>
              </div>
            </motion.div>

          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="bg-navy text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 grid md:grid-cols-12 gap-12 md:gap-8 items-start text-left">

          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center mb-6">
              <div className="bg-white px-6 py-3 rounded-2xl shadow-lg">
                <img
                  src="/logo.png"
                  alt="Clarity InfoTech Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Professional, corporate-focused IT consulting, DevOps systems, and software engineering. We secure your platform assets.
            </p>
          </div>

          {/* Col 2: Contact Info */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="font-extrabold text-sm tracking-wider uppercase text-white/40 mb-6">Contact Info</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                San Antonio, Texas
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary flex-shrink-0" />
                +098 765 432
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary flex-shrink-0" />
                yourmail@com
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Affiliations */}
          <div className="md:col-span-4 flex flex-col">
            <h4 className="font-extrabold text-sm tracking-wider uppercase text-white/40 mb-6">Trust & Affiliations</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {["AWS & GCP Enterprise Partner", "ISO 27001 Certified Security", "DevOps Systems Association"].map((link) => (
                <li key={link} className="flex items-center">
                  <a href="#" className="group relative py-1 hover:text-white transition-colors duration-200">
                    {link}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-8 text-xs text-white/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p>&copy; 2026 Clarity InfoTech / Rain Corraya. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
