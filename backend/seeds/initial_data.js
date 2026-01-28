const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('audit_logs').del();
  await knex('certificates').del();
  await knex('certificate_counters').del();
  await knex('donations').del();
  await knex('donors').del();
  await knex('trust_settings').del();
  await knex('users').del();

  // Create Admin and Staff users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  const [adminId] = await knex('users').insert([
    {
      name: 'HST Admin',
      email: 'admin@helptoselfhelptrust.org',
      password_hash: adminPassword,
      role: 'ADMIN',
      is_active: true
    },
    {
      name: 'HST Staff',
      email: 'staff@helptoselfhelptrust.org',
      password_hash: staffPassword,
      role: 'STAFF',
      is_active: true
    }
  ]);

  // Create initial trust settings
  await knex('trust_settings').insert({
    trust_name: 'Help To Self Help Trust',
    address_line1: '53/27, Pope Andavar Street',
    address_line2: 'Chetpet',
    city: 'Thiruvannamalai',
    state: 'Tamil Nadu',
    pincode: '606801',
    phone: '+91 98650 86296',
    email: 'contact@helptoselfhelptrust.org',
    pan_number: 'AAATH4490F',
    reg_80g_no: 'AAATH4490FF20218',
    authorized_signatory_name: 'Vivek Shankar',
    authorized_signatory_designation: 'Managing Trustee',
    certificate_prefix: 'HST-80G',
    currency: 'INR'
  });

  // Create initial certificate counter for the current year
  const currentYear = new Date().getFullYear();
  await knex('certificate_counters').insert({
    year: currentYear,
    last_seq: 0
  });
};
