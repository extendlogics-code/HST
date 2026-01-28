/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('donations', (table) => {
    table.enum('status', ['PENDING', 'COMPLETED', 'CANCELLED']).defaultTo('PENDING');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('donations', (table) => {
    table.dropColumn('status');
  });
};
