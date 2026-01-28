/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('visitor_logs', (table) => {
    table.increments('id').primary();
    table.string('ip_address');
    table.text('user_agent');
    table.string('path');
    table.string('referer');
    table.string('device_type'); // mobile, tablet, desktop
    table.string('browser');
    table.string('os');
    table.string('city');
    table.string('country');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('visitor_logs');
};
