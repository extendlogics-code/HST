/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_about', (table) => {
    table.string('trustee_name').nullable();
    table.string('trustee_degree').nullable();
    table.string('trustee_title').nullable();
    table.text('trustee_message').nullable();
    table.string('trustee_image').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_about', (table) => {
    table.dropColumn('trustee_name');
    table.dropColumn('trustee_degree');
    table.dropColumn('trustee_title');
    table.dropColumn('trustee_message');
    table.dropColumn('trustee_image');
  });
};
