import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, History, CheckCircle2, Loader2, Quote, User, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api, { BASE_URL } from './api/api';

const AboutUs = () => {
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, headerRes, footerRes] = await Promise.all([
          api.get('/website/about'),
          api.get('/website/header'),
          api.get('/website/footer')
        ]);

        if (aboutRes.data.success) {
          const fetchedData = aboutRes.data.data;
          setData({
            ...fetchedData,
            objectives: typeof fetchedData.objectives === 'string' ? JSON.parse(fetchedData.objectives) : (fetchedData.objectives || []),
            images: typeof fetchedData.images === 'string' ? JSON.parse(fetchedData.images) : (fetchedData.images || []),
            trustee_image_url: fetchedData.trustee_image_url || fetchedData.trustee_image
          });
        }
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  if (!data) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />
      
      {/* 1. Hero Section - The Entry Block */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 hst-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px] translate-y-1/2 opacity-30" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Rooted in Service, Driven by Impact
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              About Our <br />
              <span className="text-white/90">Foundation</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg lg:text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed"
            >
              {data.subtitle || 'Empowering individuals and communities since 2000.'}
            </motion.p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 space-y-32 py-32">
        
        {/* 2. Mission Block - Clean & Minimal */}
        <motion.section 
          {...fadeInUp}
          className="bg-white rounded-[60px] p-12 lg:p-24 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-hst-teal" />
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block px-4 py-1.5 bg-hst-teal/10 rounded-lg">
              <h2 className="text-xs font-black text-hst-teal uppercase tracking-[0.4em]">{data.mission_title || 'Mission'}</h2>
            </div>
            <h3 className="text-3xl lg:text-5xl font-black text-hst-dark leading-tight tracking-tight">
              Sustainable development through <span className="text-hst-teal">empowerment</span>.
            </h3>
            <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed italic">
              "{data.mission_statement}"
            </p>
          </div>
        </motion.section>

        {/* 2.5 Rolling Slideshow Section */}
        {data.images && data.images.length > 0 && (
          <section className="relative py-10 overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee hover:pause">
              {[...data.images, ...data.images].map((img, i) => (
                <div key={i} className="inline-block mx-4 w-[300px] h-[200px] rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0">
                  <img 
                    src={(() => {
                      if (!img) return '';
                      if (img.startsWith('http')) {
                        return img.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = img.startsWith('/') ? img : `/${img}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={`Slide ${i}`} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Founder's Block - Modern & Authoritative */}
        <motion.section 
          {...fadeInUp}
          className="bg-white rounded-[60px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* Text Content Block - Now on Left */}
            <div className="lg:col-span-3 p-12 lg:p-20 flex flex-col justify-center space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-hst-teal" />
                  <h2 className="text-xs font-black text-hst-teal uppercase tracking-[0.4em]">Founder's Message</h2>
                </div>
                <h3 className="text-3xl lg:text-5xl font-black text-hst-dark tracking-tighter leading-none flex flex-wrap items-baseline gap-2">
                  {data.founder_name}
                  {(data.founder_degree || data.founder_name.includes('Dr.')) && (
                    <span className="text-lg lg:text-xl font-bold text-gray-400">
                      {data.founder_degree || (data.founder_name.includes('Dr.') ? 'Ph.D' : '')}
                    </span>
                  )}
                </h3>
                <p className="text-hst-teal font-bold text-lg tracking-wide">{data.founder_title}</p>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium max-h-[400px] overflow-y-auto pr-4 custom-scrollbar text-justify">
                {data.founder_bio ? data.founder_bio.split('\n').map((para, i) => (
                  para.trim() && <p key={i}>{para}</p>
                )) : <p className="text-left">Biography not available.</p>}
              </div>

              <div className="bg-hst-light/50 border border-hst-teal/10 p-8 rounded-[32px] relative">
                <Quote className="text-hst-teal absolute -top-4 -left-4 opacity-50" size={32} />
                <p className="text-hst-dark text-lg font-bold italic leading-relaxed">
                  {data.founder_quote}
                </p>
              </div>
            </div>

            {/* Image Block - Now on Right */}
            <div className="lg:col-span-2 relative h-full min-h-[500px] order-1 lg:order-2 group overflow-hidden">
              {data.founder_image_url ? (
                <>
                  <img 
                    src={(() => {
                      const url = data.founder_image_url;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={data.founder_name} 
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-all duration-1000 group-hover:scale-110"
                  />
                  {/* Modern Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-hst-dark/60 via-hst-dark/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
                  
                  {/* Interactive Accent Overlay */}
                  <div className="absolute inset-0 border-[12px] border-white/10 group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-hst-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </>
              ) : (
                <div className="absolute inset-0 bg-hst-light flex items-center justify-center text-hst-teal/20">
                  <User size={120} strokeWidth={1} />
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* 3.5 Managing Trustee Block - The Current Leadership */}
        <motion.section 
          {...fadeInUp}
          className="bg-white rounded-[60px] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* Image Block - Now on Left for Visual Variety */}
            <div className="lg:col-span-2 relative h-full min-h-[500px] group overflow-hidden">
              {data.trustee_image_url ? (
                <>
                  <img 
                    src={(() => {
                      const url = data.trustee_image_url;
                      if (!url) return '';
                      if (url.startsWith('http')) {
                        return url.replace('http://localhost:5000', BASE_URL);
                      }
                      const cleanPath = url.startsWith('/') ? url : `/${url}`;
                      return `${BASE_URL}${cleanPath}`;
                    })()} 
                    alt={data.trustee_name} 
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-all duration-1000 group-hover:scale-110"
                  />
                  {/* Modern Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-hst-dark/60 via-hst-dark/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
                  
                  {/* Interactive Accent Overlay */}
                  <div className="absolute inset-0 border-[12px] border-white/10 group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-hst-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </>
              ) : (
                <div className="absolute inset-0 bg-hst-light flex items-center justify-center text-hst-teal/20">
                  <User size={120} strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Text Content Block */}
            <div className="lg:col-span-3 p-12 lg:p-20 flex flex-col justify-center space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-hst-green" />
                  <h2 className="text-xs font-black text-hst-green uppercase tracking-[0.4em]">Message from the Managing Trustee</h2>
                </div>
                <h3 className="text-3xl lg:text-5xl font-black text-hst-dark tracking-tighter leading-none flex flex-wrap items-baseline gap-2">
                  {data.trustee_name}
                  {data.trustee_degree && (
                    <span className="text-lg lg:text-xl font-bold text-gray-400">
                      {data.trustee_degree}
                    </span>
                  )}
                </h3>
                <p className="text-hst-green font-bold text-lg tracking-wide">{data.trustee_title}</p>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium text-justify">
                {data.trustee_message ? data.trustee_message.split('\n').map((para, i) => (
                  para.trim() && <p key={i}>{para}</p>
                )) : <p className="text-left">Message not available.</p>}
              </div>

            </div>
          </div>
        </motion.section>

        {/* 4. Origin & Objectives - Side-by-Side Blocks */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Origin Block */}
          <motion.section 
            {...fadeInUp}
            className="bg-white rounded-[60px] p-12 lg:p-16 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden flex flex-col h-full"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-hst-light flex items-center justify-center text-hst-green shrink-0 shadow-inner">
                <History size={32} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-hst-dark tracking-tighter">{data.origin_title || 'Our History'}</h2>
            </div>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium text-justify flex-1">
              {data.origin_content ? data.origin_content.split('\n').slice(0, 3).map((para, i) => (
                para.trim() && (
                  <p key={i} className="relative pl-8">
                    <span className="absolute left-0 top-3 w-2 h-2 rounded-full bg-hst-teal/30" />
                    {para}
                  </p>
                )
              )) : <p className="text-left">Origin content not available.</p>}
            </div>
          </motion.section>

          {/* Objectives Block */}
          <motion.section 
            {...fadeInUp}
            className="bg-hst-teal rounded-[60px] p-12 lg:p-16 shadow-xl shadow-hst-teal/20 relative overflow-hidden text-white flex flex-col h-full"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                <Target size={32} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{data.objectives_title || 'Strategic Goals'}</h2>
            </div>

            <div className="grid gap-6 flex-1">
              {data.objectives && data.objectives.slice(0, 5).map((obj, i) => (
                <div key={i} className="flex items-start gap-4 group/obj">
                  <div className="mt-1.5 shrink-0 text-white/50 group-hover/obj:text-white transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-white/90 font-bold text-lg leading-relaxed group-hover/obj:text-white transition-colors text-justify">{obj}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

      </main>

      {/* 5. Final CTA Block */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <motion.div 
          {...fadeInUp}
          className="bg-hst-green rounded-[60px] p-12 lg:p-24 text-center text-white relative overflow-hidden group shadow-xl shadow-hst-green/20"
        >
          <div className="absolute inset-0 bg-hst-teal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-none">
              Ready to create <br /> lasting impact?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 font-medium max-w-2xl mx-auto">
              Join us in our mission to empower communities and foster self-reliance.
            </p>
            <div className="pt-6">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-hst-green rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-black/10"
              >
                Get Involved <ArrowRight size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer data={footerData} />
      <ScrollNavigator />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default AboutUs;
