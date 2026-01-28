/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('donors', (table) => {
    // Already added 'country' in 20260125204019_add_city_country_to_donors.js
    // But let's check if we need to add other fields
    table.string('ngo_type').nullable();
    table.string('tax_id').nullable();
    table.string('contact_person_name').nullable();
    table.string('contact_person_designation').nullable();
    table.string('funding_category').nullable();
    table.string('funding_cycle_type').nullable();
    table.string('cycle_duration').nullable();
    table.date('grant_start_date').nullable();
    table.date('grant_end_date').nullable();
    table.string('funding_status').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('donors', (table) => {
    table.dropColumn('ngo_type');
    table.dropColumn('tax_id');
    table.dropColumn('contact_person_name');
    table.dropColumn('contact_person_designation');
    table.dropColumn('funding_category');
    table.dropColumn('funding_cycle_type');
    table.dropColumn('cycle_duration');
    table.dropColumn('grant_start_date');
    table.dropColumn('grant_end_date');
    table.dropColumn('funding_status');
  });
};
