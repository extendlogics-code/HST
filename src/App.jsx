import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import Hero from './components/Hero';
import api, { BASE_URL } from './api/api';
import { getFullUrl } from './utils/urlHelper';
import { BookOpen, Activity, Sprout, CheckCircle2, ArrowRight, Calendar, User, MapPin, Heart, Facebook, Twitter, Instagram, Mail, Phone, Loader2, TrendingUp, Users, Target, GraduationCap, Briefcase } from 'lucide-react';

const iconMap = {
  Activity: <Activity size={24} />,
  Users: <Users size={24} />,
  Heart: <Heart size={24} />,
  Target: <Target size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  Briefcase: <Briefcase size={24} />,
  TrendingUp: <TrendingUp size={24} />
};
import logo from '../assets/images/hstlogo.svg';
import footerLogo from '../assets/images/hstlogoonly.svg';
import heroBg from '../assets/images/hero-bg.jpg';
import aboutImg from '../assets/images/about-hst.jpg';
import womenEmpowerment from '../assets/images/women-empowerment.jpg';
import organicFarming from '../assets/images/organic-farming.jpg';
import concreteHousing from '../assets/images/concrete-housing.jpg';
import skillTraining from '../assets/images/skill-training.jpg';
import socioEnv from '../assets/images/socio-env.jpg';
import teachTrain from '../assets/images/teach-train.jpg';
import healthEducation from '../assets/images/health-education.jpg';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [sections, setSections] = useState([]);
  const [impactStats, setImpactStats] = useState([]);
  const [partners, setPartners] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [causes, setCauses] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [news, setNews] = useState([]);
  const [ctaData, setCtaData] = useState(null);
  const [legalitiesData, setLegalitiesData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAboutImage, setCurrentAboutImage] = useState(0);
  const aboutImages = aboutData?.images 
    ? (typeof aboutData.images === 'string' ? JSON.parse(aboutData.images) : aboutData.images) 
    : [aboutData?.image_url || aboutImg];

  useEffect(() => {
    if (aboutData?.images) {
      const images = typeof aboutData.images === 'string' ? JSON.parse(aboutData.images) : aboutData.images;
      if (images.length > 1) {
        const timer = setInterval(() => {
          setCurrentAboutImage(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
      }
    }
  }, [aboutData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchMap = {
          sections: api.get('/website/sections'),
          stats: api.get('/website/impact-stats'),
          partners: api.get('/website/partners'),
          about: api.get('/website/about'),
          causes: api.get('/website/causes'),
          initiatives: api.get('/initiatives'),
          news: api.get('/website/news'),
          cta: api.get('/website/cta'),
          legalities: api.get('/website/legalities'),
          header: api.get('/website/header'),
          footer: api.get('/website/footer')
        };

        const results = {};
        const keys = Object.keys(fetchMap);
        
        const responses = await Promise.allSettled(Object.values(fetchMap));
        
        responses.forEach((result, index) => {
          const key = keys[index];
          if (result.status === 'fulfilled') {
            results[key] = result.value.data;
          } else {
            console.error(`Failed to fetch ${key}:`, result.reason);
            results[key] = { success: false, data: [] };
          }
        });

        if (results.sections?.success) setSections(results.sections.data);
        if (results.stats?.success) setImpactStats(results.stats.data);
        if (results.partners?.success) setPartners(results.partners.data);
        if (results.about?.success) setAboutData(results.about.data);
        if (results.causes?.success) setCauses(results.causes.data);
        if (results.initiatives?.success) setInitiatives(results.initiatives.data);
        if (results.news?.success) setNews(results.news.data);
        if (results.cta?.success) setCtaData(results.cta.data);
        if (results.legalities?.success) setLegalitiesData(results.legalities.data);
        if (results.header?.success) setHeaderData(results.header.data);
        if (results.footer?.success) setFooterData(results.footer.data);
      } catch (err) {
        console.error('Failed to fetch website data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle scrolling to hash sections on mount and when sections load
  useEffect(() => {
    if (!loading && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 300);
      }
    }
  }, [loading, sections]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
        <p className="text-hst-dark font-bold animate-pulse">Loading HST Website...</p>
      </div>
    </div>
  );

  const renderSection = (section) => {
    if (!section.is_active) return null;

    switch (section.section_key) {
      case 'hero':
        return <Hero key="hero" />;
      
      case 'about':
        if (!aboutData) return null;
        return (
          <section key="about" id="about-us" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-20 items-center">
                <div className="flex-1 relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 hst-gradient opacity-10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="relative h-[400px] lg:h-[600px] w-full rounded-[40px] overflow-hidden shadow-2xl z-10">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentAboutImage}
                          src={(() => {
                            const imgPath = aboutImages[currentAboutImage];
                            if (!imgPath) return aboutImg;
                            
                            // Handle absolute URLs that might have the wrong port
                            if (imgPath.startsWith('http')) {
                              return imgPath.replace('http://localhost:5000', BASE_URL);
                            }
                            
                            // Handle relative paths
                            const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
                            return `${BASE_URL}${cleanPath}`;
                          })()}
                          alt="About HST"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-hst-dark/20 to-transparent pointer-events-none" />
                    </div>
                    <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl z-20 hidden md:block border border-gray-100">
                      <div className="text-5xl font-black text-hst-green mb-1">{aboutData.experience_years}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Years of Experience</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-8">
                  <div>
                    <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm mb-4">{section.subtitle || aboutData.subtitle}</h4>
                    <h2 className="text-5xl font-black leading-[1.1]">{section.title || aboutData.title}</h2>
                  </div>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    {section.description || aboutData.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(typeof aboutData.features === 'string' ? JSON.parse(aboutData.features) : (aboutData.features || [])).map((name, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-hst-light flex items-center justify-center text-hst-green group-hover:bg-hst-green group-hover:text-white transition-all">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-hst-dark">{name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link 
                    to={aboutData.button_url} 
                    className="bg-hst-dark text-white px-10 py-5 rounded-full font-bold hover:bg-hst-teal transition-all inline-flex items-center gap-3 w-fit"
                  >
                    {aboutData.button_text} <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'legalities':
        if (!legalitiesData) return null;
        return (
          <section key="legalities" className="bg-hst-light/30 py-24 px-6 border-t border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                <div>
                  <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm mb-4">{section.subtitle || 'Official Compliance'}</h4>
                  <h2 className="text-4xl font-black text-hst-dark" dangerouslySetInnerHTML={{ __html: (section.title || 'Trust Legalities').replace('Legalities', '<span class="text-hst-teal">Legalities</span>') }} />
                </div>
                <Link to="/legal" className="hst-gradient text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-hst-teal/20 hover:scale-105 transition-all">
                  View Detailed Compliance
                </Link>
              </div>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-12">
                <div className="space-y-4">
                  <h4 className="text-hst-teal font-black uppercase tracking-widest text-xs">{legalitiesData.managing_trustee ? 'Managing Trustee' : ''}</h4>
                  <p className="text-hst-dark font-bold text-sm leading-relaxed">
                    {legalitiesData.managing_trustee}<br />
                    <span className="text-gray-400 font-medium text-[10px]">{legalitiesData.contact_person_label}</span>
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-hst-teal font-black uppercase tracking-widest text-xs">Legal Status</h4>
                  <p className="text-hst-dark font-bold text-sm leading-relaxed">
                    {legalitiesData.legal_status}<br />
                    <span className="text-gray-400 font-medium">Reg No: {legalitiesData.registration_number}</span>
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-hst-teal font-black uppercase tracking-widest text-xs">Tax Exemptions</h4>
                  <p className="text-hst-dark font-bold text-sm leading-relaxed">
                    {legalitiesData.tax_exemption_label}<br />
                    <span className="text-gray-400 font-medium text-[10px]">{legalitiesData.tax_exemption_value}</span>
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-hst-teal font-black uppercase tracking-widest text-xs">Compliance</h4>
                  <p className="text-hst-dark font-bold text-sm leading-relaxed">
                    FCRA: {legalitiesData.fcra_number}<br />
                    PAN: {legalitiesData.pan_number}<br />
                    CSR: {legalitiesData.csr_number}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-hst-teal font-black uppercase tracking-widest text-xs">NGO Darpan</h4>
                  <p className="text-hst-dark font-bold text-sm leading-relaxed">
                    NITI Aayog ID<br />
                    <span className="text-gray-400 font-medium">{legalitiesData.ngo_darpan_id}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'causes':
        if (causes.length === 0) return null;
        return (
          <section key="causes" id="causes" className="py-32 bg-hst-light/50 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm">{section.subtitle || 'Recent Causes'}</h4>
                <h2 className="text-5xl font-black text-hst-dark" dangerouslySetInnerHTML={{ __html: (section.title || 'Our Latest Causes').replace('Causes', '<span class="text-hst-teal">Causes</span>') }} />
                <p className="text-gray-500 font-medium">{section.description || 'Invest in the future by supporting our ongoing initiatives for a better world.'}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                {causes.filter(c => c.is_active).map((cause, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -15 }}
                    className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-hst-dark/5 group border border-gray-100 flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img 
                        src={getFullUrl(cause.image_url)} 
                        alt={cause.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-6 left-6 bg-hst-green text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                        {cause.category}
                      </div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col space-y-6">
                      <div className="space-y-6 flex-1">
                        <h3 className="text-2xl font-black text-hst-dark leading-tight group-hover:text-hst-teal transition-colors">
                          {cause.title}
                        </h3>
                        
                        {/* Progress Bar */}
                        {!!cause.show_progress && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Raised: <span className="text-hst-dark">${cause.raised_amount}</span></div>
                              <div className="text-hst-green font-black">{Math.round((cause.raised_amount / cause.goal_amount) * 100)}%</div>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.min(100, (cause.raised_amount / cause.goal_amount) * 100)}%` }}
                                className="h-full hst-gradient rounded-full"
                              />
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Goal: <span className="text-hst-dark">${cause.goal_amount}</span></div>
                          </div>
                        )}

                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {cause.description}
                        </p>
                      </div>

                      <Link 
                        to="/donate"
                        className="w-full py-4 rounded-2xl border-2 border-gray-100 font-black text-hst-dark hover:bg-hst-teal hover:border-hst-teal hover:text-white transition-all text-center block mt-auto"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'initiatives':
        if (initiatives.length === 0) return null;
        return (
          <section key="initiatives" id="initiatives" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-20">
                <div className="space-y-4">
                  <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm">{section.subtitle || 'Empowering Communities'}</h4>
                  <h2 className="text-5xl font-black text-hst-dark" dangerouslySetInnerHTML={{ __html: (section.title || 'Our Core Programmes').replace('Programmes', '<span class="text-hst-teal">Programmes</span>') }} />
                </div>
                <Link to="/initiatives" className="hidden md:flex items-center gap-2 font-bold text-hst-teal hover:text-hst-green transition-colors">
                  View All Initiatives <ArrowRight size={20} />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {initiatives.filter(p => p.is_active).map((project, i) => {
                  const images = typeof project.images === 'string' 
                    ? JSON.parse(project.images) 
                    : project.images || [];
                  const displayImage = images[0] || project.image_url;
                  
                  return (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="relative h-[450px] rounded-[40px] overflow-hidden group"
                  >
                    <img 
                      src={(() => {
                        const url = displayImage;
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-hst-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                      <div className="flex items-center gap-2 text-hst-green font-bold text-xs uppercase tracking-widest">
                        <MapPin size={14} /> {project.location}
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight">{project.title}</h3>
                      <p className="text-white/70 text-sm line-clamp-2 font-medium">{project.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          project.status === 'Ongoing' ? 'bg-hst-teal text-white' : 'bg-hst-green text-white'
                        }`}>
                          {project.status}
                        </span>
                        <Link 
                          to="/initiatives" 
                          state={{ activeSlug: project.slug }}
                          className="text-white font-bold text-xs uppercase tracking-widest hover:text-hst-green transition-colors flex items-center gap-2"
                        >
                          Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )})}
              </div>
            </div>
          </section>
        );

      case 'partners':
        if (!partners || partners.length === 0) return null;
        return (
          <section key="partners" id="partners" className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm mb-4">{section.subtitle || 'Our Network'}</h4>
                <h2 className="text-4xl font-black text-hst-dark" dangerouslySetInnerHTML={{ __html: (section.title || 'Trusted by Partners').replace('Partners', '<span class="text-hst-teal">Partners</span>') }} />
              </div>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-16 lg:gap-x-20">
                {partners.map((partner, i) => (
                  <a 
                    key={i} 
                    href={partner.website_url || '#'}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-4 group transition-all duration-500 opacity-80 hover:opacity-100"
                  >
                    <div className="h-12 md:h-16 flex items-center justify-center">
                      <img 
                        src={(() => {
                          const url = partner.logo_url;
                          if (!url) return '';
                          if (url.startsWith('http')) {
                            return url.replace('http://localhost:5000', BASE_URL);
                          }
                          const cleanPath = url.startsWith('/') ? url : `/${url}`;
                          return `${BASE_URL}${cleanPath}`;
                        })()} 
                        alt={partner.name} 
                        className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-hst-teal transition-colors text-center max-w-[150px]">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        if (!ctaData) return null;
        return (
          <section key="cta" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div 
                className={`rounded-[60px] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 ${
                  ctaData.background_type === 'gradient' ? 'hst-gradient' : ''
                }`}
                style={{
                  backgroundColor: ctaData.background_type === 'color' ? ctaData.background_value : undefined,
                  backgroundImage: ctaData.background_type === 'image' 
                    ? `url(${(() => {
                        const url = ctaData.background_value;
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()})` 
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 right-0 w-96 h-96 hst-gradient opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 hst-gradient opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                </div>

                <div className="flex-1 relative z-10 text-center lg:text-left space-y-8">
                  <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                    {ctaData.title}
                  </h2>
                  <p className="text-white/60 text-lg max-w-md font-medium">
                    {ctaData.description}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Link to={ctaData.button_url} className="bg-white text-hst-dark px-10 py-5 rounded-full font-black text-lg hover:bg-hst-green hover:text-white transition-all">
                      {ctaData.button_text}
                    </Link>
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    {impactStats.length > 0 ? (
                      impactStats.filter(s => s.is_active).slice(0, 4).map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-center group hover:bg-white/10 transition-all">
                          <div className="flex justify-center mb-4 text-hst-green group-hover:scale-110 transition-transform">
                            {iconMap[stat.icon] || <Users size={24} />}
                          </div>
                          <div className="text-4xl font-black text-hst-green mb-2">{stat.value}</div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/100 transition-colors">{stat.label}</div>
                        </div>
                      ))
                    ) : (
                      [
                        { label: "Volunteers", val: "500+" },
                        { label: "Projects", val: "120+" },
                        { label: "Donors", val: "1.5k" },
                        { label: "Cities", val: "45+" }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-center group hover:bg-white/10 transition-all">
                          <div className="text-4xl font-black text-hst-green mb-2">{stat.val}</div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/100 transition-colors">{stat.label}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'news':
        if (news.length === 0) return null;
        return (
          <section key="news" id="news" className="py-32 bg-hst-light/30 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm">{section.subtitle || 'Latest Updates'}</h4>
                <h2 className="text-5xl font-black text-hst-dark" dangerouslySetInnerHTML={{ __html: (section.title || 'News & Articles').replace('Articles', '<span class="text-hst-teal">Articles</span>') }} />
                <p className="text-gray-500 font-medium">{section.description || 'Stay updated with our latest activities and stories of impact.'}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                {news.filter(n => n.is_active).map((item, i) => (
                  <motion.article 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-10 rounded-[40px] shadow-xl shadow-hst-dark/5 border border-gray-100 group hover:border-hst-teal transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-hst-light flex items-center justify-center text-hst-green font-bold">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                          {new Date(item.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-sm font-bold text-hst-dark">by {item.author}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-hst-dark leading-tight mb-6 group-hover:text-hst-teal transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8">
                      {item.excerpt}
                    </p>
                    <Link to="/news" className="flex items-center gap-2 font-black text-hst-dark uppercase tracking-widest text-[10px] group-hover:text-hst-green transition-colors">
                      Read More <ArrowRight size={16} />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const isHeaderActive = sections.find(s => s.section_key === 'header')?.is_active !== 0;
  const isFooterActive = sections.find(s => s.section_key === 'footer')?.is_active !== 0;

  return (
    <div className="min-h-screen bg-white font-sans text-hst-dark overflow-x-hidden">
      {isHeaderActive && <Header data={headerData} />}
      
      <main id="home" className={isHeaderActive ? "mt-[80px] md:mt-[112px]" : ""}>
        {sections.length > 0 ? (
          sections
            .filter(s => s.section_key !== 'header' && s.section_key !== 'footer')
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(section => renderSection(section))
        ) : (
          <Hero />
        )}
      </main>

      {isFooterActive && <Footer data={footerData} />}
      <ScrollNavigator />
    </div>
  );
}

export default App;
