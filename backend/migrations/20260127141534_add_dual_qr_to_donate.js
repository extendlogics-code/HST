/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_donate', (table) => {
    table.renameColumn('qr_code_url', 'local_qr_code_url');
    table.string('fcra_qr_code_url').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_donate', (table) => {
    table.renameColumn('local_qr_code_url', 'qr_code_url');
    table.dropColumn('fcra_qr_code_url');
  });
};
