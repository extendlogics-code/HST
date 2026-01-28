/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_causes', (table) => {
    table.boolean('show_progress').defaultTo(false).after('goal_amount');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_causes', (table) => {
    table.dropColumn('show_progress');
  });
};
