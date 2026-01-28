import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api, { BASE_URL } from './api/api';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const LandingPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, headerRes, footerRes] = await Promise.all([
          api.get(`/website/landing-pages`),
          api.get('/website/header'),
          api.get('/website/footer')
        ]);

        if (pageRes.data.success) {
          const currentPage = pageRes.data.data.find(p => p.slug === slug);
          setPage(currentPage);
        }
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (error) {
        console.error('Error fetching landing page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header data={headerData} />
        <main className="flex-1 flex items-center justify-center bg-hst-light/30">
          <div className="text-center space-y-6 max-w-md px-6">
            <div className="w-24 h-24 bg-hst-teal/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl font-black text-hst-teal">404</span>
            </div>
            <h1 className="text-3xl font-black text-hst-dark">Page Not Found</h1>
            <p className="text-gray-500 font-medium">The page you're looking for doesn't exist or has been moved.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-hst-teal text-white px-8 py-4 rounded-2xl font-bold hover:bg-hst-dark transition-all shadow-lg shadow-hst-teal/20"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer data={footerData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header data={headerData} />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {page.image_url ? (
            <img 
              src={(() => {
                const url = page.image_url;
                if (!url) return '';
                if (url.startsWith('http')) {
                  return url.replace('http://localhost:5000', BASE_URL);
                }
                const cleanPath = url.startsWith('/') ? url : `/${url}`;
                return `${BASE_URL}${cleanPath}`;
              })()} 
              alt={page.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 hst-gradient" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-hst-teal text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {page.page_name}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                  {page.title}
                </h1>
                {page.subtitle && (
                  <p className="text-xl text-white/80 font-medium leading-relaxed max-w-2xl">
                    {page.subtitle}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div 
                className="landing-page-content"
                dangerouslySetInnerHTML={{ __html: page.content }} 
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Reusing global styles */}
        <section className="py-20 bg-hst-light/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-hst-dark rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-hst-teal rounded-full blur-[120px]" />
              </div>
              
              <div className="relative z-10 max-w-2xl space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Want to support this <span className="text-hst-teal">initiative?</span>
                </h2>
                <p className="text-white/60 text-lg font-medium">
                  Your contribution can help us expand our reach and make a lasting impact in the communities we serve.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/donate"
                    className="bg-hst-teal text-white px-10 py-5 rounded-2xl font-black hover:bg-white hover:text-hst-dark transition-all shadow-xl shadow-hst-teal/20"
                  >
                    Donate Now
                  </Link>
                  <Link 
                    to="/contact"
                    className="bg-white/10 text-white backdrop-blur-md px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all border border-white/10"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer data={footerData} />
      <ScrollNavigator />

      <style>{`
        .landing-page-content h2 {
          font-weight: 900;
          color: #1a1a1a;
          font-size: 2.5rem;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .landing-page-content h3 {
          font-weight: 900;
          color: #1a1a1a;
          font-size: 1.875rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .landing-page-content p {
          color: #4b5563;
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .landing-page-content ul {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .landing-page-content li {
          color: #4b5563;
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .landing-page-content strong {
          color: #1a1a1a;
          font-weight: 700;
        }
        .landing-page-content img {
          border-radius: 2rem;
          margin: 3rem 0;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
