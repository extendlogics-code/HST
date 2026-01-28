/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('donors', (table) => {
    table.string('donor_type').alter(); // Change to string first to allow any value
  }).then(() => {
    return knex.schema.alterTable('donors', (table) => {
      table.enum('donor_type', ['INDIVIDUAL', 'CORPORATE', 'INTERNATIONAL', 'COMPANY']).defaultTo('INDIVIDUAL').alter();
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('donors', (table) => {
    table.enum('donor_type', ['INDIVIDUAL', 'COMPANY']).defaultTo('INDIVIDUAL').alter();
  });
};
