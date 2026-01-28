import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import defaultLogo from '../../assets/images/hstlogo.svg';
import { BASE_URL } from '../api/api';

import { getFullUrl } from '../utils/urlHelper';

const Header = ({ data }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const logo = getFullUrl(data?.logo_url, defaultLogo);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (Array.isArray(data?.nav_links) && data.nav_links.length > 0) 
    ? data.nav_links 
    : [
        { name: 'Home', path: 'home' },
        { 
          name: 'About Us', 
          path: 'about-us',
          dropdown: [
            { name: 'Read Our Story', path: '/about' },
            { name: 'Legal Information', path: '/legal' }
          ]
        },
        { name: 'Causes', path: 'causes' },
        { name: 'Initiatives', path: 'initiatives' },
        { name: 'News', path: '/news' },
        { name: 'Partners', path: 'partners' },
        { name: 'Contact', path: 'contact' },
      ];

  const getHref = (path) => {
    if (!path) return '#';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return isHomePage ? `#${path}` : `/#${path}`;
  };

  const handleNavClick = (e, path) => {
    if (!path) return;
    
    // If it's a hash link on the home page
    if (isHomePage && (path.startsWith('#') || (!path.startsWith('/') && !path.startsWith('http')))) {
      const targetId = path.startsWith('#') ? path.substring(1) : path;
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        setIsMobileMenuOpen(false);
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const renderLink = (item, isMobile = false, key = null) => {
    const isHash = item.path && !item.path.startsWith('/') && !item.path.startsWith('http');
    const href = getHref(item.path);

    if (isHash) {
      return (
        <a 
          key={key}
          href={href}
          onClick={(e) => handleNavClick(e, item.path)}
          className={isMobile ? "hover:text-hst-green transition-colors" : "flex items-center gap-1 hover:text-hst-green transition-colors py-4"}
        >
          {item.name}
          {!isMobile && item.dropdown && item.dropdown.length > 0 && <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />}
          {!isMobile && <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-hst-green transition-all group-hover:w-full" />}
        </a>
      );
    }

    return (
      <Link
        key={key}
        to={item.path}
        className={isMobile ? "hover:text-hst-green transition-colors" : "flex items-center gap-1 hover:text-hst-green transition-colors py-4"}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.name}
        {!isMobile && item.dropdown && item.dropdown.length > 0 && <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />}
        {!isMobile && <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-hst-green transition-all group-hover:w-full" />}
      </Link>
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Main Header */}
      <header 
        className={`bg-white transition-all duration-300 ${
          isSticky 
          ? 'shadow-xl py-2' 
          : 'py-4 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a 
            href={getHref('home')} 
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center group cursor-pointer"
          >
            <div className={`w-auto flex items-center justify-center bg-white rounded-xl px-4 group-hover:scale-105 transition-all duration-300 ${isSticky ? 'h-12' : 'h-16 md:h-20'}`}>
              <img 
                src={logo} 
                alt="HST Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-wider ${isSticky ? 'text-hst-dark' : 'text-hst-dark'}`}>
            {navLinks.map((item, idx) => (
              <div 
                key={`${item.name}-${idx}`} 
                className="relative group"
              >
                {renderLink(item)}

                {item.dropdown && item.dropdown.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="w-56 bg-white shadow-2xl p-3 border border-gray-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{ borderRadius: '32px' }}>
                      <div className="space-y-1">
                        {item.dropdown.map((subItem, sIdx) => (
                          <div key={`${subItem.name}-${sIdx}`} className="block">
                            {renderLink(subItem, false, `${subItem.name}-${sIdx}`)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              to="/donate"
              className="hidden sm:block hst-gradient text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-hst-teal/20 hover:scale-105 active:scale-95 transition-all"
            >
              Donate Now
            </Link>
            <button 
              className="lg:hidden p-2 text-hst-dark"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <div className="p-6 flex flex-col gap-4 font-bold text-hst-dark">
            {navLinks.map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="flex flex-col gap-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  {renderLink(item, true)}
                  {item.dropdown && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }}
                      className="p-2 text-gray-400"
                    >
                      <ChevronDown size={20} className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.dropdown && activeDropdown === item.name && (
                  <div className="flex flex-col gap-3 pl-4 pb-2">
                    {item.dropdown.map((subItem, sIdx) => (
                      <div key={`${subItem.name}-${sIdx}`} className="text-sm font-bold text-gray-500 py-2 border-b border-gray-50 last:border-0">
                        {renderLink(subItem, true)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link 
              to="/donate"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hst-gradient text-white text-center py-4 rounded-2xl mt-2 font-black tracking-widest uppercase text-xs"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
