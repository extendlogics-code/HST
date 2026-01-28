/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('website_legalities', (table) => {
    table.increments('id').primary();
    table.string('managing_trustee').nullable();
    table.string('contact_person_label').defaultTo('Contact Person');
    table.string('legal_status').nullable();
    table.string('registration_number').nullable();
    table.string('tax_exemption_label').defaultTo('12AA/80G Certificate');
    table.string('tax_exemption_value').nullable();
    table.string('fcra_number').nullable();
    table.string('pan_number').nullable();
    table.string('ngo_darpan_id').nullable();
    table.string('registered_office').nullable();
    table.timestamps(true, true);
  }).then(() => {
    return knex('website_legalities').insert({
      managing_trustee: 'Vivek Shankar',
      legal_status: 'Registered under Indian Trust Act 1882',
      registration_number: '625/2000',
      tax_exemption_value: 'AAATH4490FE20038 / AAATH4490FF20218',
      fcra_number: '76080066',
      pan_number: 'AAATH4490F',
      ngo_darpan_id: 'TN/2017/0169112',
      registered_office: '53/27, Pope Andavar Street, Chetpet, Thiruvannamalai, Tamil Nadu, India - 606801'
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('website_legalities');
};
