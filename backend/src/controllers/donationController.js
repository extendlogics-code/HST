const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// @desc    Get all donations
// @route   GET /api/v1/donations
// @access  Private
exports.getDonations = async (req, res) => {
  try {
    const donations = await db('donations')
      .join('donors', 'donations.donor_id', 'donors.id')
      .select(
        'donations.*',
        'donors.donor_name',
        'donors.donor_type',
        'donors.email',
        'donors.phone',
        'donors.pan'
      )
      .orderBy('donations.created_at', 'desc');
    res.json({ success: true, data: donations });
  } catch (error) {
    console.error('Get Donations Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update donation status
// @route   PATCH /api/v1/donations/:id/status
// @access  Public (for confirmation) / Private (for admin)
exports.updateDonationStatus = async (req, res) => {
  const { status, transaction_ref } = req.body;
  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (transaction_ref) updateData.transaction_ref = transaction_ref;
    
    await db('donations').where({ id: req.params.id }).update(updateData);
    
    await auditLogger(req, 'UPDATE_DONATION_STATUS', 'donations', req.params.id, req.body);
    
    res.json({ success: true, message: 'Donation updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create donation
// @route   POST /api/v1/donations
// @access  Private/Public (depending on request source)
exports.createDonation = async (req, res) => {
  const { amount, payment_mode, requires80G, pan, name, email, phone, donor_id, type, donor_type } = req.body;

  // Validation: Minimum donation amount
  if (!amount || Number(amount) < 100) {
    return res.status(400).json({ 
      success: false, 
      error: 'Minimum donation amount is 100' 
    });
  }

  // NGO Compliance check: CASH > 2000
  if (payment_mode === 'CASH' && amount > 2000) {
    // Note: The UI should have already warned, but we handle it here if needed
  }

  try {
    let final_donor_id = donor_id;

    // If it's a public donation (no donor_id) or we have extra info
    if (!final_donor_id && name) {
      // Check if donor exists by email
      let donor = null;
      if (email) {
        // Find existing donor by email
        const existingDonor = await db('donors').where({ email }).first();
        
        if (existingDonor) {
          // If name or phone is different, mark as duplicate and create new entry
          const nameMatches = existingDonor.donor_name.trim().toLowerCase() === name.trim().toLowerCase();
          const phoneMatches = !phone || (existingDonor.phone && existingDonor.phone.trim() === phone.trim());

          if (!nameMatches || !phoneMatches) {
            // Different details for same email - create NEW entry and tag as duplicate
            const [new_id] = await db('donors').insert({
              donor_name: name,
              email,
              phone,
              pan: pan || null,
              donor_type: donor_type || 'INDIVIDUAL',
              is_duplicate: true,
              category: type === 'fcra' ? 'foreign' : 'local'
            });
            final_donor_id = new_id;
          } else {
            // Existing donor with same details
            donor = existingDonor;
            final_donor_id = donor.id;
            // Update PAN and category if provided and not already set
            const updateData = {};
            if (pan && !donor.pan) updateData.pan = pan;
            if (type && donor.category !== (type === 'fcra' ? 'foreign' : 'local')) {
              updateData.category = type === 'fcra' ? 'foreign' : 'local';
            }
            if (Object.keys(updateData).length > 0) {
              await db('donors').where({ id: donor.id }).update(updateData);
            }
          }
        }
      } else if (phone) {
        // No email provided, check by phone
        donor = await db('donors').where({ phone }).first();
        if (donor) {
          final_donor_id = donor.id;
          const updateData = {};
          if (pan && !donor.pan) updateData.pan = pan;
          if (type && donor.category !== (type === 'fcra' ? 'foreign' : 'local')) {
            updateData.category = type === 'fcra' ? 'foreign' : 'local';
          }
          if (Object.keys(updateData).length > 0) {
            await db('donors').where({ id: donor.id }).update(updateData);
          }
        }
      }

      // If still no donor found, create new one
      if (!final_donor_id) {
        const [new_id] = await db('donors').insert({
          donor_name: name,
          email,
          phone,
          pan: pan || null,
          donor_type: donor_type || 'INDIVIDUAL',
          is_duplicate: false,
          category: type === 'fcra' ? 'foreign' : 'local'
        });
        final_donor_id = new_id;
      }
    }

    const donationData = {
      donor_id: final_donor_id,
      amount,
      payment_mode: payment_mode || 'ONLINE',
      donation_date: req.body.donation_date || new Date(),
      transaction_ref: req.body.transaction_ref || null,
      bank_name: req.body.bank_name || null,
      purpose: req.body.purpose || 'General Donation',
      remarks: req.body.remarks || (requires80G ? '80G Certificate Requested' : null),
      type: type || 'local',
      status: req.body.status || 'PENDING',
      is_direct_certificate: req.body.is_direct_certificate || false,
      created_by: req.user ? req.user.id : null
    };

    const [id] = await db('donations').insert(donationData);
    
    const donation = await db('donations').where({ id }).first();
    
    await auditLogger(req, 'CREATE_DONATION', 'donations', id, req.body);
    
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error('Create Donation Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
