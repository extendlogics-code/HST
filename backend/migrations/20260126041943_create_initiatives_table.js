/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('initiatives', (table) => {
    table.increments('id').primary();
    table.string('slug').unique().notNullable();
    table.string('title').notNullable();
    table.string('icon').notNullable().defaultTo('Activity');
    table.string('location').nullable();
    table.string('status').notNullable().defaultTo('Ongoing');
    table.text('description').nullable();
    table.string('target_group').nullable();
    table.string('key_impact').nullable();
    table.string('foundation').nullable();
    table.json('images').nullable(); // Array of image URLs
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('initiatives');
};
