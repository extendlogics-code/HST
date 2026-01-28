
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_about', (table) => {
    table.string('founder_name').nullable();
    table.string('founder_title').defaultTo('Founder & Managing Trustee');
    table.text('founder_bio').nullable();
    table.string('founder_image_url').nullable();
    table.text('founder_quote').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_about', (table) => {
    table.dropColumn('founder_name');
    table.dropColumn('founder_title');
    table.dropColumn('founder_bio');
    table.dropColumn('founder_image_url');
    table.dropColumn('founder_quote');
  });
};
