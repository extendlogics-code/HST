import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Activity, Sprout, Heart, Users, Home, 
  MapPin, Calendar, CheckCircle, ArrowRight,
  ChevronRight, Menu, X, Target, Loader2
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api, { BASE_URL } from './api/api';

const Initiatives = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [initRes, headerRes, footerRes] = await Promise.all([
        api.get('/initiatives'),
        api.get('/website/header'),
        api.get('/website/footer')
      ]);

      if (initRes.data.success) {
        const parsedData = initRes.data.data.map(project => ({
          ...project,
          images: typeof project.images === 'string' 
            ? JSON.parse(project.images) 
            : project.images || []
        }));
        setProjects(parsedData);
        
        const stateSlug = location.state?.activeSlug;
        if (stateSlug && parsedData.find(p => p.slug === stateSlug)) {
          setActiveTab(stateSlug);
        } else if (parsedData.length > 0) {
          setActiveTab(parsedData[0].slug);
        }
      }
      if (headerRes.data.success) setHeaderData(headerRes.data.data);
      if (footerRes.data.success) setFooterData(footerRes.data.data);
    } catch (err) {
      console.error('Failed to fetch initiatives:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeProject = projects.find(p => p.slug === activeTab);

  // Reset image index when tab changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  // Rolling photos effect
  useEffect(() => {
    if (!activeProject || !activeProject.images?.length) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === activeProject.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [activeProject?.images?.length, activeTab]);

  const iconMap = {
    Activity: <Activity className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    Sprout: <Sprout className="w-5 h-5" />,
    Heart: <Heart className="w-5 h-5" />,
    Home: <Home className="w-5 h-5" />,
    Target: <Target className="w-5 h-5" />
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold">No initiatives found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header data={headerData} />
      
      {/* Page Header */}
      <div className="hst-gradient pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Initiatives
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Empowering communities through sustainable development, education, and social welfare programs.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100">
              <h3 className="text-xl font-bold text-hst-dark px-4 mb-4">Categories</h3>
              <nav className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveTab(project.slug)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                      activeTab === project.slug 
                      ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/30' 
                      : 'text-gray-500 hover:bg-hst-light hover:text-hst-teal'
                    }`}
                  >
                    <span className={activeTab === project.slug ? 'text-white' : 'text-hst-teal'}>
                      {iconMap[project.icon] || <Activity className="w-5 h-5" />}
                    </span>
                    <span className="truncate">{project.title}</span>
                    {activeTab === project.slug && (
                      <ChevronRight size={18} className="ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Nav Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="w-full bg-white p-4 rounded-2xl shadow-md flex items-center justify-between font-bold text-hst-dark"
            >
              <div className="flex items-center gap-3">
                <span className="text-hst-teal">
                  {activeProject ? (iconMap[activeProject.icon] || <Activity className="w-5 h-5" />) : <Activity className="w-5 h-5" />}
                </span>
                {activeProject?.title}
              </div>
              <Menu size={20} className="text-hst-teal" />
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {isMobileNavOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] lg:hidden"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)} />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-hst-dark">Initiatives</h3>
                    <button onClick={() => setIsMobileNavOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                      <X size={20} />
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveTab(project.slug);
                          setIsMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                          activeTab === project.slug 
                          ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/30' 
                          : 'text-gray-500 hover:bg-hst-light hover:text-hst-teal'
                        }`}
                      >
                        <span className={activeTab === project.slug ? 'text-white' : 'text-hst-teal'}>
                          {iconMap[project.icon] || <Activity className="w-5 h-5" />}
                        </span>
                        {project.title}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-[21/9] w-full relative group">
                    <AnimatePresence mode="wait">
                      {activeProject.images && activeProject.images.length > 0 && (
                        <motion.img 
                          key={`${activeTab}-${currentImageIndex}`}
                          src={(() => {
                            const url = activeProject.images[currentImageIndex];
                            if (!url) return '';
                            if (url.startsWith('http')) {
                              return url.replace('http://localhost:5000', BASE_URL);
                            }
                            const cleanPath = url.startsWith('/') ? url : `/${url}`;
                            return `${BASE_URL}${cleanPath}`;
                          })()} 
                          alt={activeProject.title}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                      {activeProject.images?.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            currentImageIndex === idx ? 'w-8 bg-hst-green' : 'w-2 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-6 left-8 right-8 z-10">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 flex items-center gap-1.5">
                          <MapPin size={12} /> {activeProject.location}
                        </span>
                        <span className="px-3 py-1 bg-hst-green text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle size={12} /> {activeProject.status}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{activeProject.title}</h2>
                    </div>
                  </div>

                  <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-12">
                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <h3 className="text-2xl font-bold text-hst-dark mb-4">About the Project</h3>
                          <div className="prose prose-lg text-gray-600 max-w-none">
                            {activeProject.description || activeProject.fullDesc}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="p-6 bg-hst-light rounded-2xl border border-hst-teal/10">
                            <h4 className="font-bold text-hst-teal mb-2 flex items-center gap-2">
                              <Users size={18} /> Target Group
                            </h4>
                            <p className="text-gray-600">{activeProject.target_group || 'Women, Youth & Local Communities'}</p>
                          </div>
                          <div className="p-6 bg-hst-green/5 rounded-2xl border border-hst-green/10">
                            <h4 className="font-bold text-hst-green mb-2 flex items-center gap-2">
                              <Activity size={18} /> Key Impact
                            </h4>
                            <p className="text-gray-600">{activeProject.key_impact || 'Sustainable Income & Better Quality of Life'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <h4 className="font-bold text-hst-dark mb-4">Foundation Support</h4>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                            <div className="w-10 h-10 bg-hst-teal/10 rounded-lg flex items-center justify-center text-hst-teal">
                              <Sprout size={20} />
                            </div>
                            <span className="font-medium text-gray-700">{activeProject.foundation || 'Charitable & Social Welfare Mission'}</span>
                          </div>
                        </div>

                        <motion.a 
                          href="/donate"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-hst-teal text-white py-4 rounded-2xl font-bold shadow-lg shadow-hst-teal/20 flex items-center justify-center gap-2 group"
                        >
                          Support this Initiative
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-hst-dark py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="text-hst-orange w-16 h-16 mx-auto mb-6 fill-hst-orange animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Every Small Action Creates a Big Wave of Change</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">Join us in our mission to create a self-sufficient society where every individual has the opportunity to thrive.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a 
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-hst-dark rounded-2xl font-bold text-lg shadow-2xl"
            >
              Get Involved
            </motion.a>
            <motion.a 
              href="/donate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-hst-teal text-white rounded-2xl font-bold text-lg shadow-2xl shadow-hst-teal/20 flex items-center justify-center gap-3"
            >
              Support Us Now <ArrowRight size={20} />
            </motion.a>
          </div>
        </div>
      </div>

      <Footer data={footerData} />
      <ScrollNavigator />
    </div>
  );
};

export default Initiatives;