import React from 'react';
import { FileText, MapPin, IndianRupee, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import { getFullUrl } from '../utils/urlHelper';

const numberToWords = (num) => {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_array) return '';
    let str = '';
    str += (Number(n_array[1]) !== 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'crore ' : '';
    str += (Number(n_array[2]) !== 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'lakh ' : '';
    str += (Number(n_array[3]) !== 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'thousand ' : '';
    str += (Number(n_array[4]) !== 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'hundred ' : '';
    str += (Number(n_array[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) + 'only' : '';
    return str.trim().toUpperCase();
  };
  return inWords(num);
};

const LiveCertificatePreview = ({ donor, donation, settings, isPreview = true, orientation = 'landscape' }) => {
  if (!settings) return null;

  const isLandscape = orientation === 'landscape';

  const amount = parseFloat(donation.amount) || 0;
  const amountInWords = numberToWords(Math.floor(amount));
  const donationDate = donation.donation_date ? new Date(donation.donation_date) : new Date();
  const formattedDonationDate = isNaN(donationDate.getTime()) 
    ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : donationDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const logoUrl = getFullUrl(settings.logo_image_url);
  const sealUrl = getFullUrl(settings.seal_image_url);
  const signatureUrl = getFullUrl(settings.signature_image_url);

  return (
    <div 
      className={`bg-white border-[12px] border-double border-hst-dark px-[40px] py-[20px] mx-auto shadow-xl text-[#1a365d] font-sans relative flex flex-col certificate-content box-border overflow-hidden ${
        isLandscape 
        ? 'w-full max-w-[297mm] h-[210mm]' 
        : 'w-[210mm] min-h-[297mm]'
      }`}
    >
      {/* Header with Logo and Trust Info */}
      <div className="flex flex-col items-center justify-center border-b-2 border-hst-dark pb-2 mb-4 text-center">
        <div className="flex items-center justify-center gap-6">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Trust Logo" 
              className="h-16 w-auto object-contain"
            />
          )}
          <div className="text-center">
            <h1 className="text-[32px] m-0 text-hst-dark uppercase tracking-[2px] font-black leading-tight">
              {settings.trust_name}
            </h1>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">80G Reg No:</span>
          <p className="text-lg font-black text-hst-dark tracking-wider">{settings.reg_80g_no}</p>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-4">
        <h2 className="text-[20px] font-black underline decoration-2 underline-offset-[4px] m-0 leading-tight uppercase">DONATION RECEIPT / CERTIFICATE UNDER SECTION 80G</h2>
        <p className="text-xs italic text-gray-500 mt-1">(Income Tax Act, 1961)</p>
      </div>

      {/* Address & Meta */}
      <div className="flex justify-between text-[12px] mb-4 leading-normal">
        <div className="w-1/2">
          <span className="font-bold text-hst-dark uppercase">Registered Address:</span><br />
          {settings.address_line1}, {settings.address_line2},<br />
          {settings.city}, {settings.state}, India - {settings.pincode}
        </div>
        <div className="w-1/2 text-right">
          <p><span className="font-bold uppercase">Certificate No:</span> <b className="text-lg ml-1">{isPreview ? 'PREVIEW-XXXX' : 'PENDING'}</b></p>
          <p><span className="font-bold uppercase">Issue Date:</span> <b className="text-lg ml-1">{issueDate}</b></p>
        </div>
      </div>

      <div className="text-center font-black text-lg uppercase border-b border-gray-100 pb-1.5 mb-3 text-hst-dark tracking-[3px]">
         Donation Certificate
       </div>

      {/* Body Content */}
        <div className="text-[15px] leading-[1.6] mb-2 text-justify">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span>This is to certify that</span>
          <span className="font-bold whitespace-nowrap">Mr./Ms./M/s.</span>
          <span className="border-b-2 border-gray-600 px-2 font-black flex-grow min-w-[220px]">{donor?.donor_name || '_________________________'}</span>
          <span>,</span>
          {donor?.pan && (
            <div className="flex items-baseline gap-x-2 flex-grow">
              <span className="whitespace-nowrap font-bold">PAN:</span>
              <span className="border-b-2 border-gray-600 px-2 font-black flex-grow min-w-[160px]">{donor.pan}</span>
              <span>,</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-x-2">
          <span className="whitespace-nowrap font-bold">Address:</span>
          <span className="border-b-2 border-gray-600 px-2 font-black flex-grow min-w-[320px]">{donor?.address || 'N/A'}</span>
          <span>,</span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span>has voluntarily donated a sum of</span>
          <span className="font-bold">₹</span>
          <span className="border-b-2 border-gray-600 px-2 font-black flex-grow min-w-[110px]">{amount.toLocaleString('en-IN')}</span>
          <span>(Rupees</span>
          <span className="border-b-2 border-gray-600 px-2 font-black flex-grow min-w-[280px]">{amountInWords}</span>
          <span>only)</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2">
          <span>towards</span>
          <span className="font-bold text-hst-dark">{settings.trust_name}</span>
          <span>on</span>
          <span className="border-b-2 border-gray-600 px-2 font-black min-w-[130px]">{formattedDonationDate}</span>
          <span>through:</span>
          <div className="flex items-center gap-5 mx-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <div className={`w-4 h-4 border-2 border-hst-dark flex items-center justify-center ${donation.payment_mode === 'CASH' ? 'bg-hst-dark' : 'bg-white'}`}>
                {donation.payment_mode === 'CASH' && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              Cash
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <div className={`w-4 h-4 border-2 border-hst-dark flex items-center justify-center ${donation.payment_mode === 'CHEQUE' ? 'bg-hst-dark' : 'bg-white'}`}>
                {donation.payment_mode === 'CHEQUE' && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              Cheque
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <div className={`w-4 h-4 border-2 border-hst-dark flex items-center justify-center ${donation.payment_mode === 'DD' ? 'bg-hst-dark' : 'bg-white'}`}>
                {donation.payment_mode === 'DD' && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              DD
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              <div className={`w-4 h-4 border-2 border-hst-dark flex items-center justify-center ${['ONLINE', 'TRANSFER', 'UPI', 'NEFT'].includes(donation.payment_mode) ? 'bg-hst-dark' : 'bg-white'}`}>
                {['ONLINE', 'TRANSFER', 'UPI', 'NEFT'].includes(donation.payment_mode) && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              Online Transfer
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="whitespace-nowrap font-bold">Transaction / Cheque No:</span>
          <span className="border-b-2 border-gray-600 px-2 font-black min-w-[180px]">{donation.transaction_ref || 'N/A'}</span>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className={`mt-4 grid ${isLandscape ? 'grid-cols-[1.5fr_1fr]' : 'grid-cols-1'} gap-[50px] pb-8 items-end`}>
        <div className="text-[12px]">
          <h4 className="font-black text-hst-dark uppercase mb-[10px] text-[13px] tracking-wider">Tax Exemption Declaration</h4>
          <p className="mb-1">The above donation is eligible for deduction under Section 80G of the <b>Income Tax Act, 1961</b>, subject to the limits prescribed under the Act.</p>
          <p className="mb-1"><b>Mode of Utilization:</b> The donation will be utilized solely for charitable purposes of the Trust.</p>
          <div className="mt-[10px]">
            <p className="font-black text-hst-dark uppercase mb-1 text-[13px]">Trust Details</p>
            <ul className="list-square ml-5 space-y-1">
              <li>PAN of Trust: <b>{settings.pan_number}</b></li>
              <li>80G Approval Validity: AY 2026-2027</li>
              <li>Nature of Trust: Charitable / Public Welfare</li>
            </ul>
          </div>
        </div>

        <div className={`flex justify-end items-end relative ${isLandscape ? '' : 'mt-8'}`}>
          <div className={`text-right w-full relative ${isLandscape ? '' : 'flex flex-col items-end'}`}>
            <h4 className="font-black text-hst-dark uppercase mb-1 text-[13px] tracking-wider">Declaration</h4>
            <p className="text-[11px] mb-[30px] leading-relaxed">We confirm that no goods or services were provided to the donor in return for this donation.</p>
            
            <div className="mt-[35px] relative">
              <p className="text-[11px] font-bold text-hst-dark uppercase mb-1">For {settings.trust_name}</p>
              {signatureUrl && <img src={signatureUrl} alt="Signature" className={`absolute ${isLandscape ? 'bottom-[55px] right-[40px]' : 'bottom-[55px] right-[20px]'} h-[65px] object-contain z-10`} />}
              {sealUrl && <img src={sealUrl} alt="Seal" className={`absolute ${isLandscape ? 'bottom-0 -right-[15px]' : 'bottom-0 -right-[10px]'} h-[100px] object-contain opacity-85`} />}
              <div className="text-[13px] font-black leading-[1.4] text-hst-dark mt-6">
                Authorized Signatory<br />
                {settings.authorized_signatory_name}<br />
                {settings.authorized_signatory_designation}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[15px] left-[50px] text-[10px] text-gray-500 italic leading-tight">
        Note: 1. This certificate should be retained by the donor for Income Tax purposes.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Deduction is subject to verification and acceptance by the Income Tax Department.
      </div>
    </div>
  );
};

export default LiveCertificatePreview;
