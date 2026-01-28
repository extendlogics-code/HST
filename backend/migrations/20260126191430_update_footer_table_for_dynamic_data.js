/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('website_footer', (table) => {
    table.text('quick_links').nullable();
    // In SQLite, we can't easily change column types, but we can store JSON in existing string/text columns.
    // However, to be clear, we'll ensure they are text if possible or just use them as is.
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('website_footer', (table) => {
    table.dropColumn('quick_links');
  });
};
