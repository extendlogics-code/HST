const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// @desc    Get all donors
// @route   GET /api/v1/donors
// @access  Private
exports.getDonors = async (req, res) => {
  const { search } = req.query;
  try {
    let query = db('donors');
    
    if (search) {
      query = query.where(function() {
        this.where('donor_name', 'like', `%${search}%`)
            .orWhere('email', 'like', `%${search}%`)
            .orWhere('phone', 'like', `%${search}%`)
            .orWhere('pan', 'like', `%${search}%`);
      });
    }

    const donors = await query
      .leftJoin('donations', 'donors.id', 'donations.donor_id')
      .select('donors.*')
      .sum('donations.amount as total_donated')
      .groupBy('donors.id')
      .orderBy('donors.created_at', 'desc');
    res.json({ success: true, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create donor
// @route   POST /api/v1/donors
// @access  Private
exports.createDonor = async (req, res) => {
  try {
    const { 
      donor_name, email, phone, address, pan, donor_type, category,
      cin, registered_office_address, corporate_office_address, website_url,
      authorized_signatory_name, authorized_signatory_designation,
      authorized_signatory_email, authorized_signatory_phone,
      board_resolution_ref, csr_registration_number, csr_financial_year,
      nature_of_csr_contribution, csr_act_reference, schedule_vii_category,
      country, ngo_type, tax_id, contact_person_name, contact_person_designation,
      funding_category, funding_cycle_type, cycle_duration, grant_start_date,
      grant_end_date, funding_status
    } = req.body;

    const donorData = {
      donor_name, email, phone, address, pan, donor_type, category,
      cin, registered_office_address, corporate_office_address, website_url,
      authorized_signatory_name, authorized_signatory_designation,
      authorized_signatory_email, authorized_signatory_phone,
      board_resolution_ref, csr_registration_number, csr_financial_year,
      nature_of_csr_contribution, csr_act_reference, schedule_vii_category,
      country, ngo_type, tax_id, contact_person_name, contact_person_designation,
      funding_category, funding_cycle_type, cycle_duration, grant_start_date,
      grant_end_date, funding_status
    };

    // Convert empty strings to null for optional fields and remove undefined
    Object.keys(donorData).forEach(key => {
      if (donorData[key] === '' || donorData[key] === undefined) {
        donorData[key] = null;
      }
    });

    const [id] = await db('donors').insert(donorData);
    const donor = await db('donors').where({ id }).first();
    
    await auditLogger(req, 'CREATE_DONOR', 'donors', id, donorData);
    
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    console.error('Create Donor Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get donor by ID
// @route   GET /api/v1/donors/:id
// @access  Private
exports.getDonor = async (req, res) => {
  try {
    const donor = await db('donors').where({ id: req.params.id }).first();
    if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
    res.json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update donor
// @route   PATCH /api/v1/donors/:id
// @access  Private
exports.updateDonor = async (req, res) => {
  try {
    const { 
      donor_name, email, phone, address, pan, donor_type, category,
      cin, registered_office_address, corporate_office_address, website_url,
      authorized_signatory_name, authorized_signatory_designation,
      authorized_signatory_email, authorized_signatory_phone,
      board_resolution_ref, csr_registration_number, csr_financial_year,
      nature_of_csr_contribution, csr_act_reference, schedule_vii_category,
      country, ngo_type, tax_id, contact_person_name, contact_person_designation,
      funding_category, funding_cycle_type, cycle_duration, grant_start_date,
      grant_end_date, funding_status
    } = req.body;

    const updateData = {
      donor_name, email, phone, address, pan, donor_type, category,
      cin, registered_office_address, corporate_office_address, website_url,
      authorized_signatory_name, authorized_signatory_designation,
      authorized_signatory_email, authorized_signatory_phone,
      board_resolution_ref, csr_registration_number, csr_financial_year,
      nature_of_csr_contribution, csr_act_reference, schedule_vii_category,
      country, ngo_type, tax_id, contact_person_name, contact_person_designation,
      funding_category, funding_cycle_type, cycle_duration, grant_start_date,
      grant_end_date, funding_status
    };

    // Convert empty strings to null for optional fields and remove undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === undefined) {
        updateData[key] = null;
      }
    });

    await db('donors').where({ id: req.params.id }).update(updateData);
    const donor = await db('donors').where({ id: req.params.id }).first();
    
    await auditLogger(req, 'UPDATE_DONOR', 'donors', req.params.id, updateData);
    
    res.json({ success: true, data: donor });
  } catch (error) {
    console.error('Update Donor Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
