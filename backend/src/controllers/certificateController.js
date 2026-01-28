const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

// @desc    Get all certificates
// @route   GET /api/v1/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const certs = await db('certificates')
      .join('donations', 'certificates.donation_id', 'donations.id')
      .join('donors', 'donations.donor_id', 'donors.id')
      .select('certificates.*', 'donors.donor_name', 'donations.amount')
      .orderBy('certificates.created_at', 'desc');
    res.json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Generate certificate for a donation
// @route   POST /api/v1/certificates
// @access  Private
exports.createCertificate = async (req, res) => {
  const { donation_id, orientation = 'landscape' } = req.body;

  const trx = await db.transaction();

  try {
    // 1. Check if certificate already exists
    const existing = await trx('certificates').where({ donation_id }).first();
    if (existing) {
      await trx.rollback();
      return res.status(400).json({ success: false, error: 'Certificate already issued for this donation' });
    }

    // 2. Get donation and donor details
    const donation = await trx('donations').where({ id: donation_id }).first();
    if (!donation) {
      await trx.rollback();
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }
    const donor = await trx('donors').where({ id: donation.donor_id }).first();
    const settings = await trx('trust_settings').first();

    // 3. Generate Certificate Number (HST-80G-YYYY-XXXX)
    const currentYear = new Date(donation.donation_date).getFullYear();
    let counter = await trx('certificate_counters').where({ year: currentYear }).forUpdate().first();
    
    if (!counter) {
      await trx('certificate_counters').insert({ year: currentYear, last_seq: 0 });
      counter = { year: currentYear, last_seq: 0 };
    }

    const nextSeq = counter.last_seq + 1;
    const certNo = `${settings.certificate_prefix}-${currentYear}-${nextSeq.toString().padStart(4, '0')}`;

    // 4. Generate PDF
    const pdfUrl = await generateCertificatePDF({
      donor,
      donation,
      settings,
      certificate_no: certNo,
      issue_date: new Date(),
      orientation
    });

    // 5. Save to database
    const [certId] = await trx('certificates').insert({
      donation_id,
      certificate_no: certNo,
      issue_date: db.fn.now(),
      pdf_url: pdfUrl,
      issued_by: req.user.id
    });

    // 6. Update counter
    await trx('certificate_counters').where({ year: currentYear }).update({ last_seq: nextSeq });

    await trx.commit();

    await auditLogger(req, 'GENERATE_CERTIFICATE', 'certificates', certId, { certNo });

    res.status(201).json({ success: true, data: { id: certId, certificate_no: certNo, pdf_url: pdfUrl } });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error during certificate generation' });
  }
};

// @desc    Preview certificate for a donation
// @route   POST /api/v1/certificates/preview
// @access  Private
exports.previewCertificate = async (req, res) => {
  const { donation_id } = req.body;

  try {
    const donation = await db('donations').where({ id: donation_id }).first();
    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }
    const donor = await db('donors').where({ id: donation.donor_id }).first();
    const settings = await db('trust_settings').first();

    // Mock a certificate number for preview
    const certNo = 'PREVIEW-XXXX';

    const pdfBuffer = await generateCertificatePDF({
      donor,
      donation,
      settings,
      certificate_no: certNo,
      isPreview: true
    });

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PREVIEW_RAW_ERROR:', error);
    res.status(500).json({ success: false, error: 'Server Error during preview generation: ' + error.message });
  }
};

// @desc    Preview certificate for a donation (using raw data)
// @route   POST /api/v1/certificates/preview-raw
// @access  Private
exports.previewRawCertificate = async (req, res) => {
  const { donor, donation, settings, orientation = 'landscape' } = req.body;

  try {
    // Mock a certificate number for preview
    const certNo = 'PREVIEW-XXXX';

    const pdfBuffer = await generateCertificatePDF({
      donor,
      donation,
      settings,
      certificate_no: certNo,
      isPreview: true,
      orientation
    });

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error during preview generation' });
  }
};

// @desc    Get certificate PDF
// @route   GET /api/v1/certificates/:id/pdf
// @access  Private
exports.getCertificatePDF = async (req, res) => {
  try {
    const cert = await db('certificates').where({ id: req.params.id }).first();
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' });

    const filePath = path.resolve(cert.pdf_url);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'PDF file not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Regenerate certificate PDF
// @route   POST /api/v1/certificates/:id/regenerate-pdf
// @access  Private
exports.regenerateCertificatePDF = async (req, res) => {
  try {
    const cert = await db('certificates').where({ id: req.params.id }).first();
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' });

    const donation = await db('donations').where({ id: cert.donation_id }).first();
    const donor = await db('donors').where({ id: donation.donor_id }).first();
    const settings = await db('trust_settings').first();

    const pdfUrl = await generateCertificatePDF({
      donor,
      donation,
      settings,
      certificate_no: cert.certificate_no,
      issue_date: cert.issue_date
    });

    await db('certificates').where({ id: req.params.id }).update({ pdf_url: pdfUrl });

    await auditLogger(req, 'REGENERATE_PDF', 'certificates', req.params.id);

    res.json({ success: true, data: { pdf_url: pdfUrl } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Void a certificate
// @route   PATCH /api/v1/certificates/:id/void
// @access  Private (Admin Only)
exports.voidCertificate = async (req, res) => {
  const { void_reason } = req.body;
  try {
    const cert = await db('certificates').where({ id: req.params.id }).first();
    if (!cert) return res.status(404).json({ success: false, error: 'Certificate not found' });

    await db('certificates').where({ id: req.params.id }).update({
      status: 'VOIDED',
      void_reason
    });

    await auditLogger(req, 'VOID_CERTIFICATE', 'certificates', req.params.id, { void_reason });

    res.json({ success: true, message: 'Certificate voided' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
