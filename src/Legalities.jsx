import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Landmark, ShieldCheck, CreditCard, User, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollNavigator from './components/ScrollNavigator';
import api from './api/api';

const Legalities = () => {
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegalities = async () => {
      try {
        const [legalRes, headerRes, footerRes] = await Promise.all([
          api.get('/website/legalities'),
          api.get('/website/header'),
          api.get('/website/footer')
        ]);
        if (legalRes.data.success) {
          setData(legalRes.data.data);
        }
        if (headerRes.data.success) setHeaderData(headerRes.data.data);
        if (footerRes.data.success) setFooterData(footerRes.data.data);
      } catch (err) {
        console.error('Failed to fetch legalities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLegalities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-hst-teal" size={48} />
      </div>
    );
  }

  const legalDetails = data ? [
    { label: "Organization Name", value: "HELP TO SELF HELP TRUST", icon: User },
    { label: "Managing Trustee", value: data.managing_trustee, icon: User },
    { label: "Legal Status", value: data.legal_status, icon: ShieldCheck },
    { label: "Registration Number", value: data.registration_number, icon: FileText },
    { label: data.tax_exemption_label, value: data.tax_exemption_value, icon: Landmark },
    { label: "FCRA Registration", value: data.fcra_number, icon: ShieldCheck },
    { label: "PAN Number", value: data.pan_number, icon: CreditCard },
    { label: "CSR Registration", value: data.csr_number, icon: ShieldCheck },
    { label: "NITI Aayog / NGO Darpan ID", value: data.ngo_darpan_id, icon: FileText },
  ] : [];

  return (
    <div className="min-h-screen bg-hst-light/30 font-sans text-hst-dark overflow-x-hidden">
      <Header data={headerData} />
      
      <div className="max-w-4xl mx-auto pt-40 pb-20 px-6 lg:pt-48">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-hst-dark/5 p-10 lg:p-16 border border-gray-100"
        >
          <div className="text-center mb-16">
            <h4 className="text-hst-green font-black uppercase tracking-[0.3em] text-sm mb-4">Transparency & Compliance</h4>
            <h1 className="text-4xl lg:text-5xl font-black text-hst-dark">Legal <span className="text-hst-teal">Information</span></h1>
            <p className="text-gray-500 mt-6 font-medium max-w-2xl mx-auto">
              Help to Self Help Trust is committed to full transparency and adherence to all legal regulations under the Indian Trust Act and relevant authorities.
            </p>
          </div>

          <div className="grid gap-6">
            {legalDetails.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-hst-light/20 border border-transparent hover:border-hst-teal/30 hover:bg-white transition-all group gap-4"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-hst-teal shadow-sm group-hover:bg-hst-teal group-hover:text-white transition-all">
                    <item.icon size={22} />
                  </div>
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">{item.label}</span>
                </div>
                <div className="flex items-center gap-3 sm:justify-end flex-1">
                  <span className="font-black text-hst-dark text-base lg:text-lg text-left sm:text-right break-words flex-1">
                    {item.value}
                  </span>
                  <CheckCircle2 size={18} className="text-hst-green shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Registered Office: {data?.registered_office}
            </p>
          </div>
        </motion.div>
      </div>
      <Footer data={footerData} />
      <ScrollNavigator />
    </div>
  );
};

export default Legalities;
