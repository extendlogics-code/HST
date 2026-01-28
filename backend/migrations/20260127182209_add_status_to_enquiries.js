/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('enquiries', (table) => {
    table.enum('status', ['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM']).defaultTo('NEW');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('enquiries', (table) => {
    table.dropColumn('status');
  });
};
