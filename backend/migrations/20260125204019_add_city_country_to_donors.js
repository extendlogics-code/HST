/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('donors', (table) => {
    table.string('city').nullable();
    table.string('country').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('donors', (table) => {
    table.dropColumn('city');
    table.dropColumn('country');
  });
};
