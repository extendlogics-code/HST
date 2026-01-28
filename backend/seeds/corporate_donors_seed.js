/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // We don't want to delete existing donors, just add new ones if they don't exist
  // or just insert them as samples.

  const corporateDonors = [
    {
      donor_name: 'Tech Mahindra Foundation',
      donor_type: 'CORPORATE',
      category: 'local',
      email: 'csr@techmahindra.com',
      phone: '022-12345678',
      address: 'Gateway Building, Apollo Bunder, Mumbai 400001',
      city: 'Mumbai',
      country: 'India',
      pan: 'AAACT1234F',
      cin: 'U85190PN2007NPL130312',
      registered_office_address: 'Gateway Building, Apollo Bunder, Mumbai 400001',
      website_url: 'https://techmahindrafoundation.org',
      authorized_signatory_name: 'Rakesh Soni',
      authorized_signatory_designation: 'CSR Head',
      authorized_signatory_email: 'rakesh.soni@techmahindra.com',
      authorized_signatory_phone: '+91 98765 43210',
      csr_registration_number: 'CSR00001234',
      csr_financial_year: '2025-26',
      nature_of_csr_contribution: 'Ongoing project',
      schedule_vii_category: 'Education & Vocational Training'
    },
    {
      donor_name: 'HDFC Bank Limited',
      donor_type: 'CORPORATE',
      category: 'local',
      email: 'csr@hdfcbank.com',
      phone: '022-66521000',
      address: 'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
      city: 'Mumbai',
      country: 'India',
      pan: 'AAACH1234D',
      cin: 'L65920MH1994PLC080618',
      registered_office_address: 'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
      website_url: 'https://www.hdfcbank.com/csr',
      authorized_signatory_name: 'Nusrat Pathan',
      authorized_signatory_designation: 'Head - CSR',
      authorized_signatory_email: 'nusrat.pathan@hdfcbank.com',
      authorized_signatory_phone: '+91 98200 11223',
      csr_registration_number: 'CSR00005678',
      csr_financial_year: '2025-26',
      nature_of_csr_contribution: 'One-time',
      schedule_vii_category: 'Healthcare & Sanitation'
    }
  ];

  for (const donorData of corporateDonors) {
    // Check if donor already exists by PAN or Name
    const existingDonor = await knex('donors').where({ pan: donorData.pan }).orWhere({ donor_name: donorData.donor_name }).first();
    
    let donorId;
    if (!existingDonor) {
      [donorId] = await knex('donors').insert(donorData);
    } else {
      donorId = existingDonor.id;
      await knex('donors').where({ id: donorId }).update(donorData);
    }

    // Add a sample donation for each
    const donationData = {
      donor_id: donorId,
      amount: donorData.donor_name.includes('Tech Mahindra') ? 500000.00 : 250000.00,
      payment_mode: donorData.donor_name.includes('Tech Mahindra') ? 'BANK_TRANSFER' : 'CHEQUE',
      transaction_ref: donorData.donor_name.includes('Tech Mahindra') ? 'UTR123456789' : 'CHQ001122',
      bank_name: donorData.donor_name.includes('Tech Mahindra') ? 'ICICI Bank' : 'HDFC Bank',
      purpose: donorData.donor_name.includes('Tech Mahindra') ? 'Smart Classroom Project' : 'Mobile Medical Unit',
      status: 'COMPLETED',
      type: 'local',
      csr_amount_sanctioned: donorData.donor_name.includes('Tech Mahindra') ? 1000000.00 : 250000.00,
      amount_released: donorData.donor_name.includes('Tech Mahindra') ? 500000.00 : 250000.00,
      installment_details: donorData.donor_name.includes('Tech Mahindra') ? 'Phase 1 of 2' : 'Full Payment',
      donation_date: new Date()
    };

    // Check if donation already exists
    const existingDonation = await knex('donations').where({ donor_id: donorId, transaction_ref: donationData.transaction_ref }).first();
    if (!existingDonation) {
      await knex('donations').insert(donationData);
    }
  }
};
