import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, Search, Filter, X, User, Share2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api, { BASE_URL } from './api/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, headerRes, footerRes] = await Promise.all([
          api.get('/website/news'),
          api.get('/website/header'),
          api.get('/website/footer')
        ]);
        
        if (newsRes.data.success) setNews(newsRes.data.data);
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (err) {
        console.error('Failed to fetch news data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', ...new Set(news.map(item => item.category || 'General'))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || (item.category || 'General') === category;
    return matchesSearch && matchesCategory && item.is_active;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hst-light">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hst-light/30 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden hst-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20"
          >
            Stay Updated
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter"
          >
            News & <span className="text-white/80">Articles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Insights, updates, and stories of impact from our work across the communities we serve.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-8 lg:p-10 rounded-[40px] shadow-2xl shadow-hst-dark/5 border border-gray-100 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 rounded-2xl bg-hst-light border-none focus:ring-2 focus:ring-hst-teal font-bold"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  category === cat 
                    ? 'bg-hst-teal text-white shadow-lg shadow-hst-teal/20' 
                    : 'bg-hst-light text-gray-400 hover:text-hst-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNews.map((item, i) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[40px] shadow-xl shadow-hst-dark/5 border border-gray-100 group overflow-hidden flex flex-col h-full"
              >
                {item.image_url && (
                  <div className="h-64 overflow-hidden shrink-0">
                    <img 
                      src={(() => {
                        const url = item.image_url;
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-10 flex-1 flex flex-col">
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
                  
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-black text-hst-dark leading-tight group-hover:text-hst-teal transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    {item.show_popup ? (
                      <button 
                        onClick={() => setSelectedArticle(item)}
                        className="flex items-center gap-2 font-black text-hst-dark uppercase tracking-widest text-[10px] group-hover:text-hst-green transition-colors"
                      >
                        Read Full Story <ArrowRight size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 font-black text-gray-300 uppercase tracking-widest text-[10px]">
                        General Update
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[60px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-hst-light rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black text-hst-dark mb-2">No articles found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      <Footer data={footerData} />
      <ScrollNavigator />

      {/* Article Popup Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-hst-dark/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header/Close */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform text-hst-dark"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto">
                {/* Hero Image in Modal */}
                {selectedArticle.image_url && (
                  <div className="h-64 md:h-[400px] w-full relative">
                    <img 
                      src={(() => {
                        const url = selectedArticle.image_url;
                        if (!url) return '';
                        if (url.startsWith('http')) {
                          return url.replace('http://localhost:5000', BASE_URL);
                        }
                        const cleanPath = url.startsWith('/') ? url : `/${url}`;
                        return `${BASE_URL}${cleanPath}`;
                      })()} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  </div>
                )}

                <div className="p-8 md:p-16 -mt-20 relative z-10">
                  <div className="max-w-3xl mx-auto">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 mb-10">
                      <div className="px-4 py-2 bg-hst-teal/10 rounded-full text-hst-teal text-[10px] font-black uppercase tracking-widest">
                        {selectedArticle.category || 'General'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Calendar size={14} className="text-hst-green" />
                        {new Date(selectedArticle.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <User size={14} className="text-hst-green" />
                        {selectedArticle.author}
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-hst-dark mb-10 leading-tight tracking-tighter">
                      {selectedArticle.title}
                    </h2>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-xl font-bold text-hst-teal mb-10 leading-relaxed italic border-l-4 border-hst-teal pl-6">
                        {selectedArticle.excerpt}
                      </p>
                      <div className="text-gray-600 font-medium leading-loose whitespace-pre-line text-lg">
                        {selectedArticle.content || 'No detailed content available for this article.'}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-16 pt-10 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-2xl bg-hst-light flex items-center justify-center text-hst-dark hover:bg-hst-teal hover:text-white transition-all">
                          <Share2 size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedArticle(null)}
                        className="px-8 py-4 bg-hst-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-hst-teal transition-all shadow-lg shadow-hst-dark/20"
                      >
                        Close Article
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
