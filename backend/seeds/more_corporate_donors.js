/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const corporateDonors = [
    {
      donor_name: 'Infosys Foundation',
      donor_type: 'CORPORATE',
      category: 'local',
      email: 'foundation@infosys.com',
      phone: '080-26530101',
      address: 'Electronic City, Hosur Road, Bangalore 560100',
      city: 'Bangalore',
      country: 'India',
      pan: 'AAACI1234E',
      cin: 'U85110KA1996NPL021487',
      registered_office_address: 'Electronic City, Hosur Road, Bangalore 560100',
      website_url: 'https://www.infosys.com/infosys-foundation',
      authorized_signatory_name: 'Sudha Murty',
      authorized_signatory_designation: 'Chairperson',
      authorized_signatory_email: 'sudha.murty@infosys.com',
      authorized_signatory_phone: '+91 80265 30101',
      csr_registration_number: 'CSR00009999',
      csr_financial_year: '2025-26',
      nature_of_csr_contribution: 'Ongoing project',
      schedule_vii_category: 'Education & Healthcare'
    },
    {
      donor_name: 'Reliance Industries Limited',
      donor_type: 'CORPORATE',
      category: 'local',
      email: 'csr.ril@ril.com',
      phone: '022-22785000',
      address: 'Maker Chambers IV, Nariman Point, Mumbai 400021',
      city: 'Mumbai',
      country: 'India',
      pan: 'AAACR1234L',
      cin: 'L17110MH1973PLC019786',
      registered_office_address: 'Maker Chambers IV, Nariman Point, Mumbai 400021',
      website_url: 'https://www.reliancefoundation.org',
      authorized_signatory_name: 'Jagannatha Kumar',
      authorized_signatory_designation: 'CEO - Reliance Foundation',
      authorized_signatory_email: 'jagannatha.kumar@ril.com',
      authorized_signatory_phone: '+91 22227 85000',
      csr_registration_number: 'CSR00008888',
      csr_financial_year: '2025-26',
      nature_of_csr_contribution: 'One-time',
      schedule_vii_category: 'Rural Development'
    }
  ];

  for (const donorData of corporateDonors) {
    const existingDonor = await knex('donors').where({ pan: donorData.pan }).orWhere({ donor_name: donorData.donor_name }).first();
    
    let donorId;
    if (!existingDonor) {
      [donorId] = await knex('donors').insert(donorData);
    } else {
      donorId = existingDonor.id;
      await knex('donors').where({ id: donorId }).update(donorData);
    }

    const donationData = {
      donor_id: donorId,
      amount: 1500000.00,
      payment_mode: 'BANK_TRANSFER',
      transaction_ref: `UTR${Math.floor(Math.random() * 1000000000)}`,
      bank_name: 'State Bank of India',
      purpose: 'Education Support Program',
      status: 'COMPLETED',
      type: 'local',
      csr_amount_sanctioned: 1500000.00,
      amount_released: 1500000.00,
      installment_details: 'Full Payment',
      donation_date: new Date()
    };

    const existingDonation = await knex('donations').where({ donor_id: donorId, transaction_ref: donationData.transaction_ref }).first();
    if (!existingDonation) {
      await knex('donations').insert(donationData);
    }
  }
};
