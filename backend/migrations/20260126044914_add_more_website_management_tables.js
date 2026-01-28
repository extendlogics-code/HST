/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('website_sections', (table) => {
      table.increments('id').primary();
      table.string('section_key').unique().notNullable(); // e.g., 'hero', 'about', 'causes'
      table.string('name').notNullable(); // Display name
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('website_about', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('subtitle').nullable();
      table.text('description').nullable();
      table.string('image_url').nullable();
      table.string('experience_years').nullable();
      table.json('features').nullable(); // Store as JSON array of strings
      table.string('button_text').nullable();
      table.string('button_url').nullable();
      table.timestamps(true, true);
    })
    .createTable('website_causes', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').nullable();
      table.decimal('raised_amount', 15, 2).defaultTo(0);
      table.decimal('goal_amount', 15, 2).defaultTo(0);
      table.string('image_url').nullable();
      table.string('category').nullable();
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('website_news', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('content').nullable();
      table.string('excerpt').nullable();
      table.string('author').nullable();
      table.date('publish_date').nullable();
      table.string('image_url').nullable();
      table.integer('sort_order').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('website_cta', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').nullable();
      table.string('button_text').nullable();
      table.string('button_url').nullable();
      table.string('background_type').defaultTo('gradient'); // 'gradient', 'image', 'color'
      table.string('background_value').nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      // Seed initial sections
      return knex('website_sections').insert([
        { section_key: 'hero', name: 'Hero Section', sort_order: 1 },
        { section_key: 'about', name: 'About Us Section', sort_order: 2 },
        { section_key: 'legalities', name: 'Legalities Section', sort_order: 3 },
        { section_key: 'causes', name: 'Causes Section', sort_order: 4 },
        { section_key: 'initiatives', name: 'Initiatives Section', sort_order: 5 },
        { section_key: 'partners', name: 'Partners Section', sort_order: 6 },
        { section_key: 'cta', name: 'Volunteer CTA Section', sort_order: 7 },
        { section_key: 'news', name: 'News & Articles Section', sort_order: 8 }
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('website_cta')
    .dropTableIfExists('website_news')
    .dropTableIfExists('website_causes')
    .dropTableIfExists('website_about')
    .dropTableIfExists('website_sections');
};
