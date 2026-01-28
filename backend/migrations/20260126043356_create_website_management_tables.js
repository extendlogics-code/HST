/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('impact_stats', (table) => {
      table.increments('id').primary();
      table.string('label').notNullable();
      table.string('value').notNullable();
      table.string('icon').notNullable().defaultTo('Users');
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('partners', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('logo_url').notNullable();
      table.string('website_url').nullable();
      table.string('category').nullable(); // e.g., 'Corporate', 'Government', 'NGO'
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('hero_slides', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('subtitle').nullable();
      table.text('description').nullable();
      table.string('image_url').notNullable();
      table.string('button_text').nullable();
      table.string('button_url').nullable();
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
  return knex.schema
    .dropTableIfExists('hero_slides')
    .dropTableIfExists('partners')
    .dropTableIfExists('impact_stats');
};
