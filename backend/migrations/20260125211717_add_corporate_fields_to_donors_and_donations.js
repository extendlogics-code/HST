/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('donors', (table) => {
      // 1. Corporate Identification Details
      table.string('cin').nullable();
      table.text('registered_office_address').nullable();
      table.text('corporate_office_address').nullable();
      table.string('website_url').nullable();

      // 2. Authorized Signatory Details
      table.string('authorized_signatory_name').nullable();
      table.string('authorized_signatory_designation').nullable();
      table.string('authorized_signatory_email').nullable();
      table.string('authorized_signatory_phone').nullable();
      table.string('board_resolution_ref').nullable();

      // 3. CSR Compliance Details
      table.string('csr_registration_number').nullable(); // CSR-1
      table.string('csr_financial_year').nullable();
      table.string('nature_of_csr_contribution').nullable(); // One-time / Ongoing
      table.string('csr_act_reference').defaultTo('Section 135 of Companies Act, 2013');
      table.string('schedule_vii_category').nullable();
    })
    .alterTable('donations', (table) => {
      // 4. Donation / Fund Transfer Details
      table.decimal('csr_amount_sanctioned', 15, 2).nullable();
      table.decimal('amount_released', 15, 2).nullable();
      table.text('installment_details').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .alterTable('donors', (table) => {
      table.dropColumn('cin');
      table.dropColumn('registered_office_address');
      table.dropColumn('corporate_office_address');
      table.dropColumn('website_url');
      table.dropColumn('authorized_signatory_name');
      table.dropColumn('authorized_signatory_designation');
      table.dropColumn('authorized_signatory_email');
      table.dropColumn('authorized_signatory_phone');
      table.dropColumn('board_resolution_ref');
      table.dropColumn('csr_registration_number');
      table.dropColumn('csr_financial_year');
      table.dropColumn('nature_of_csr_contribution');
      table.dropColumn('csr_act_reference');
      table.dropColumn('schedule_vii_category');
    })
    .alterTable('donations', (table) => {
      table.dropColumn('csr_amount_sanctioned');
      table.dropColumn('amount_released');
      table.dropColumn('installment_details');
    });
};
