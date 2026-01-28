/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_donate', (table) => {
    table.dropColumn('fcra_qr_code_url');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_donate', (table) => {
    table.string('fcra_qr_code_url').nullable();
  });
};
