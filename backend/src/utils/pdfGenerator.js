const puppeteer = require('puppeteer');
const path = require('path');
const { numberToWords } = require('./numberToWords');

exports.generateCertificatePDF = async (data) => {
  const { donor, donation, settings, certificate_no, orientation = 'landscape' } = data;
  
  const isLandscape = orientation === 'landscape';

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one can help in memory-constrained environments
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  const amount = parseFloat(donation.amount) || 0;
  const amountInWords = numberToWords(Math.floor(amount));
  const donationDate = donation.donation_date ? new Date(donation.donation_date) : new Date();
  const formattedDonationDate = isNaN(donationDate.getTime()) 
    ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : donationDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
  const issueDate = data.issue_date ? new Date(data.issue_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Helper for absolute paths
  const getAbsPath = (relPath) => relPath ? `file://${path.resolve(relPath).replace(/\\/g, '/')}` : '';
  const sealPath = getAbsPath(settings.seal_image_url);
  const signPath = getAbsPath(settings.signature_image_url);
  const logoPath = getAbsPath(settings.logo_image_url);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4 ${orientation}; margin: 0; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 0; 
          background: #ffffff;
          color: #1a365d;
          height: ${isLandscape ? '210mm' : '297mm'};
          width: ${isLandscape ? '297mm' : '210mm'};
          overflow: hidden;
        }
        .certificate-container {
          background: white;
          border: 12px double #1a365d;
          padding: 20px 40px;
          height: 100%;
          width: 100%;
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom: 2px solid #1a365d;
          padding-bottom: 10px;
          margin-bottom: 15px;
          text-align: center;
        }
        .trust-title h1 {
          font-size: 32px;
          margin: 0;
          color: #1a365d;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 900;
          line-height: 1.1;
        }
        .cert-no-header {
          margin-top: 5px;
          font-size: 13px;
          font-weight: bold;
          color: #4b5563;
          text-transform: uppercase;
        }
        .cert-no-header b {
          font-size: 18px;
          color: #1a365d;
          letter-spacing: 1px;
        }
        .main-title {
          text-align: center;
          margin: 5px 0 15px 0;
        }
        .main-title h2 {
          font-size: 20px;
          margin: 0;
          color: #1a365d;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 900;
          line-height: 1.1;
        }
        .main-title p {
          font-size: 12px;
          font-style: italic;
          margin: 2px 0;
          color: #6b7280;
        }
        .address-section {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 15px;
          line-height: 1.4;
        }
        .address-block { width: 50%; }
        .label { font-weight: bold; color: #1a365d; text-transform: uppercase; }

        .cert-body-title {
          text-align: center;
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 12px;
          text-transform: uppercase;
          color: #1a365d;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 6px;
          letter-spacing: 3px;
        }
        
        .content-area {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 10px;
          text-align: justify;
        }
        .content-line {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 10px;
        }
        .underscore-field {
          border-bottom: 2px solid #4b5563;
          flex-grow: 1;
          padding: 0 10px;
          font-weight: 900;
          color: #1a365d;
          min-width: 100px;
        }
        .field-label {
          font-weight: bold;
          white-space: nowrap;
        }
        
        .mode-selection {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          margin: 0 10px;
        }
        .mode-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: bold;
          font-size: 14px;
        }
        .checkbox {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border: 2px solid #1a365d;
          background: #fff;
        }
        .checkbox.checked {
          background: #1a365d;
          color: #fff;
        }
        .checkbox.checked::after {
          content: '✓';
          font-size: 14px;
          font-weight: 900;
        }

        .bottom-grid {
          margin-top: 15px;
          display: grid;
          grid-template-columns: ${isLandscape ? '1.5fr 1fr' : '1fr'};
          gap: 40px;
          padding-bottom: 25px;
          align-items: flex-end;
        }
        
        .declaration-box {
          font-size: 12px;
        }
        .declaration-box h4 { margin: 0 0 10px 0; color: #1a365d; text-transform: uppercase; font-size: 13px; font-weight: 900; }
        .declaration-box p { margin: 5px 0; }
        .declaration-box ul { padding-left: 20px; margin: 8px 0; list-style-type: square; }
        .declaration-box li { margin-bottom: 4px; }

        .signatory-section {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          position: relative;
        }
        .signatory-box {
          text-align: right;
          width: 100%;
          position: relative;
          ${isLandscape ? '' : 'margin-top: 30px;'}
        }
        .signature-img {
          position: absolute;
          bottom: 55px;
          right: ${isLandscape ? '40px' : '20px'};
          height: 65px;
          z-index: 1;
        }
        .seal-img {
          position: absolute;
          bottom: 0px;
          right: ${isLandscape ? '-15px' : '-10px'};
          height: 100px;
          opacity: 0.85;
        }
        .sign-line {
          border-top: 2px solid #1a365d;
          width: 250px;
          margin: 10px 0 10px auto;
        }
        .sign-details { font-size: 13px; font-weight: 900; line-height: 1.4; }
        
        .notes {
          position: absolute;
          bottom: 15px;
          left: 50px;
          font-size: 10px;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="header">
          <div class="trust-title">
            <h1>${settings.trust_name}</h1>
          </div>
          <div class="cert-no-header">
            80G Registration No: <b>${settings.reg_80g_no}</b>
          </div>
        </div>

        <div class="main-title">
          <h2>DONATION RECEIPT / CERTIFICATE UNDER SECTION 80G</h2>
          <p>(Income Tax Act, 1961)</p>
        </div>

        <div class="address-section">
          <div class="address-block">
            <span class="label">Registered Address:</span><br>
            ${settings.address_line1}, ${settings.address_line2},<br>
            ${settings.city}, ${settings.state}, India - ${settings.pincode}
          </div>
          <div class="address-block" style="text-align: right;">
            <span class="label">Certificate No:</span> <b>${certificate_no}</b><br>
            <span class="label">Issue Date:</span> <b>${issueDate}</b>
          </div>
        </div>

        <div class="cert-body-title">Donation Certificate</div>
 
          <div class="content-area">
          <div class="content-line">
            <span>This is to certify that</span>
            <span class="field-label">Mr./Ms./M/s.</span>
            <span class="underscore-field" style="min-width: 220px;">${donor.donor_name}</span>
            <span>,</span>
            ${donor.pan ? `
            <div style="display: flex; align-items: baseline; flex-grow: 1; gap: 6px;">
              <span class="field-label">PAN:</span>
              <span class="underscore-field" style="min-width: 160px;">${donor.pan}</span>
              <span>,</span>
            </div>` : ''}
          </div>
          
          <div class="content-line">
            <span class="field-label">Address:</span>
            <span class="underscore-field" style="min-width: 320px;">${donor.address || 'N/A'}</span>
            <span>,</span>
          </div>

          <div class="content-line">
            <span>has voluntarily donated a sum of</span>
            <span class="field-label">₹</span>
            <span class="underscore-field" style="min-width: 110px;">${amount.toLocaleString('en-IN')}</span>
            <span>(Rupees</span>
            <span class="underscore-field" style="min-width: 280px;">${amountInWords}</span>
            <span>only)</span>
          </div>

          <div class="content-line">
            <span>towards</span>
            <span class="field-label">${settings.trust_name}</span>
            <span>on</span>
            <span class="underscore-field" style="min-width: 130px;">${formattedDonationDate}</span>
            <span>through:</span>
            <div class="mode-selection">
              <div class="mode-item"><div class="checkbox ${donation.payment_mode === 'CASH' ? 'checked' : ''}"></div> Cash</div>
              <div class="mode-item"><div class="checkbox ${donation.payment_mode === 'CHEQUE' ? 'checked' : ''}"></div> Cheque</div>
              <div class="mode-item"><div class="checkbox ${donation.payment_mode === 'DD' ? 'checked' : ''}"></div> DD</div>
              <div class="mode-item"><div class="checkbox ${['ONLINE', 'TRANSFER', 'UPI', 'NEFT'].includes(donation.payment_mode) ? 'checked' : ''}"></div> Online Transfer</div>
            </div>
          </div>

          <div class="content-line">
            <span class="field-label">Transaction / Cheque No:</span>
            <span class="underscore-field" style="min-width: 180px;">${donation.transaction_ref || 'N/A'}</span>
          </div>
        </div>

        <div class="bottom-grid">
          <div class="declaration-box">
            <h4>Tax Exemption Declaration</h4>
            <p>The above donation is eligible for deduction under Section 80G of the <b>Income Tax Act, 1961</b>, subject to the limits prescribed under the Act.</p>
            <p><b>Mode of Utilization:</b> The donation will be utilized solely for charitable purposes of the Trust.</p>
            <p style="margin-top: 10px;"><b>TRUST DETAILS</b></p>
            <ul>
              <li>PAN of Trust: <b>${settings.pan_number}</b></li>
              <li>80G Approval Validity: AY 2026-2027</li>
              <li>Nature of Trust: Charitable / Public Welfare</li>
            </ul>
          </div>

          <div class="signatory-section">
            <div class="signatory-box">
              <h4>Declaration</h4>
              <p style="font-size: 11px; margin-bottom: 30px;">We confirm that no goods or services were provided to the donor in return for this donation.</p>
              
              <div style="margin-top: 35px;">
                <p class="label" style="font-size: 11px;">For ${settings.trust_name}</p>
                ${signPath ? `<img class="signature-img" src="${signPath}">` : ''}
                ${sealPath ? `<img class="seal-img" src="${sealPath}">` : ''}
                <div class="sign-details" style="margin-top: 20px;">
                  Authorized Signatory<br>
                  ${settings.authorized_signatory_name}<br>
                  ${settings.authorized_signatory_designation}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="notes">
          Note: 1. This certificate should be retained by the donor for Income Tax purposes.<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Deduction is subject to verification and acceptance by the Income Tax Department.
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfOptions = {
    format: 'A4',
    landscape: isLandscape,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  };

  if (data.isPreview) {
    const buffer = await page.pdf(pdfOptions);
    await browser.close();
    return buffer;
  }

  const pdfPath = `uploads/certificates/${certificate_no}.pdf`;
  await page.pdf({
    ...pdfOptions,
    path: pdfPath
  });

  await browser.close();
  return pdfPath;
};
