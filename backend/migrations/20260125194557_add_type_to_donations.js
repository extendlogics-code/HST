/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('donations', (table) => {
    table.enum('type', ['local', 'fcra']).defaultTo('local');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('donations', (table) => {
    table.dropColumn('type');
  });
};
