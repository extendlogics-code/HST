import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import footerLogo from '../../assets/images/hstlogoonly.svg';
import { BASE_URL } from '../api/api';

const Footer = ({ data }) => {
  return (
    <footer id="contact" className="bg-hst-dark text-white/40 pt-32 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-2 space-y-10">
            <Link to="/" className="flex items-center gap-6 group">
              <div className="h-24 w-auto flex items-center justify-center bg-white rounded-2xl px-6 py-4 group-hover:scale-105 transition-transform">
                <img 
                  src={(() => {
                    const url = data?.logo_url;
                    if (!url) return footerLogo;
                    if (url.startsWith('http')) {
                      return url.replace('http://localhost:5000', BASE_URL);
                    }
                    const cleanPath = url.startsWith('/') ? url : `/${url}`;
                    return `${BASE_URL}${cleanPath}`;
                  })()} 
                  alt="HST Logo" 
                  className="h-full w-auto object-contain" 
                />
              </div>
              <div className="flex flex-col text-center group-hover:opacity-80 transition-opacity">
                <span className="text-white text-2xl font-black leading-tight tracking-tight uppercase">
                  Help To Self Help <br />
                  <span className="text-hst-teal">Trust</span>
                </span>
              </div>
            </Link>
            <p className="max-w-md text-lg leading-relaxed font-medium">
              {data?.about_text || 'Help To Self Help Trust (HST) is a non-profit organization committed to empowering individuals and communities through education, health, and sustainable development initiatives.'}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, url: data?.facebook_url },
                { Icon: Twitter, url: data?.twitter_url },
                { Icon: Instagram, url: data?.instagram_url },
                { Icon: Linkedin, url: data?.linkedin_url }
              ].filter(social => social.url).map(({ Icon, url }, i) => (
                <a 
                  key={i} 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-hst-green hover:border-hst-green transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </a>
              ))}
              {/* Fallback social icons if none are provided */}
              {(!data?.facebook_url && !data?.twitter_url && !data?.instagram_url && !data?.linkedin_url) && [
                { Icon: Facebook, url: 'https://facebook.com/helptoselfhelptrust' },
                { Icon: Twitter, url: 'https://twitter.com/hstindia' },
                { Icon: Instagram, url: 'https://instagram.com/hstindia' }
              ].map(({ Icon, url }, i) => (
                <a 
                  key={i} 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-hst-green hover:border-hst-green transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-10">
            <h4 className="text-white text-xl font-black">Quick Links</h4>
            <ul className="space-y-6 font-bold">
              {data?.quick_links && data.quick_links.length > 0 ? (
                data.quick_links.map((link, i) => (
                  <li key={i}>
                    {link.url.startsWith('http') ? (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-hst-green transition-colors flex items-center gap-2 group">
                        {link.label}
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link to={link.url} className="hover:text-hst-green transition-colors">{link.label}</Link>
                    )}
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/about" className="hover:text-hst-green transition-colors">Our History</Link></li>
                  <li><Link to="/#causes" className="hover:text-hst-green transition-colors">Current Causes</Link></li>
                  <li><Link to="/news" className="hover:text-hst-green transition-colors">Latest News</Link></li>
                  <li><Link to="/contact" className="hover:text-hst-green transition-colors">Become Volunteer</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-white text-xl font-black">Contact Us</h4>
            <ul className="space-y-8 font-medium">
              <li className="flex items-start gap-4">
                <MapPin className="text-hst-green shrink-0" size={24} />
                <span>{data?.address || 'Chetpet, Thiruvannamalai - 606801, Tamil Nadu, India.'}</span>
              </li>
              
              {data?.email && Array.isArray(data.email) && data.email.length > 0 ? (
                <li className="flex items-start gap-4">
                  <Mail className="text-hst-green shrink-0 mt-1.5" size={20} />
                  <div className="flex flex-col gap-3">
                    {data.email.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="group/mail transition-colors">
                        <span className="text-white/60 group-hover/mail:text-white transition-colors break-words">
                          {email}
                        </span>
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li className="flex items-start gap-4">
                  <Mail className="text-hst-green shrink-0 mt-1.5" size={20} />
                  <a href={`mailto:${typeof data?.email === 'string' ? data.email : 'contact@helptoselfhelptrust.org'}`} className="group/mail transition-colors">
                    <span className="text-white/60 group-hover/mail:text-white transition-colors break-words">
                      {typeof data?.email === 'string' ? data.email : 'contact@helptoselfhelptrust.org'}
                    </span>
                  </a>
                </li>
              )}

              {data?.phone && Array.isArray(data.phone) && data.phone.length > 0 ? (
                <li className="flex items-start gap-4">
                  <Phone className="text-hst-green shrink-0 mt-1" size={24} />
                  <div className="flex flex-col gap-3">
                    {data.phone.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="group/phone transition-colors">
                        <span className="text-white/60 group-hover/phone:text-white transition-colors">
                          {phone}
                        </span>
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li className="flex items-start gap-4">
                  <Phone className="text-hst-green shrink-0 mt-1" size={24} />
                  <span className="text-white/60">
                    {typeof data?.phone === 'string' ? data.phone : '+91 98650 86296, +91 87540 60638'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold uppercase tracking-[0.2em]">
          <p>{data?.copyright_text || '© 2026 Help To Self Help Trust. All rights reserved.'}</p>
          <Link to="/login" className="text-white/20 hover:text-hst-teal transition-colors">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
