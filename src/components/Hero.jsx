import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BASE_URL } from '../api/api';

import heroBg from '../../assets/images/hero-bg.jpg';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get('/website/hero-slides');
        if (res.data.success && res.data.data.length > 0) {
          setSlides(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch hero slides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const displaySlides = slides.length > 0 ? slides : [{
    title: "Self Reliance & Growth",
    subtitle: "Create a cycle of positive change",
    description: "We believe true empowerment comes from within. equiping individuals with the tools and confidence they need to succeed and contribute back to their communities.",
    image_url: null,
    button_text: "Join Us",
    button_url: "/contact"
  }];

  const current = displaySlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden bg-hst-dark">
      {/* Background Image & Gradient - Crossfade Transition */}
      <AnimatePresence>
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={(() => {
              if (!current.image_url) return heroBg;
              if (current.image_url.startsWith('http')) {
                return current.image_url.replace('http://localhost:5000', BASE_URL);
              }
              const cleanPath = current.image_url.startsWith('/') ? current.image_url : `/${current.image_url}`;
              return `${BASE_URL}${cleanPath}`;
            })()} 
            alt={current.title} 
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hst-dark via-hst-dark/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Area - Independent of BG Transition */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-hst-green font-bold text-sm tracking-widest uppercase"
              >
                <Heart size={16} className="fill-hst-green" />
                {current.subtitle}
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.h1 
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-5xl lg:text-8xl font-black text-white leading-[1] tracking-tight"
                dangerouslySetInnerHTML={{ __html: current.title.replace('&', '<span class="text-hst-green">&</span>') }}
              />
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p 
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-xl text-white/70 max-w-2xl leading-relaxed font-medium"
              >
                {current.description}
              </motion.p>
            </AnimatePresence>

            {current.button_text && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a 
                  href={current.button_url || '/contact'}
                  className="inline-block bg-hst-green text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white hover:text-hst-dark transition-all hover:scale-105 active:scale-95"
                >
                  {current.button_text}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-hst-dark transition-all hover:scale-110 active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-hst-dark transition-all hover:scale-110 active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;
