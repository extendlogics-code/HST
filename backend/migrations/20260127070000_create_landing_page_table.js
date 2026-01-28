
exports.up = function(knex) {
  return knex.schema.createTable('website_landing_page', function(table) {
    table.increments('id').primary();
    table.string('page_name').defaultTo('Landing Page');
    table.string('title').nullable();
    table.string('subtitle').nullable();
    table.text('content').nullable(); // Will store HTML or JSON content
    table.string('image_url').nullable();
    table.string('slug').unique().defaultTo('special-initiative');
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('website_landing_page');
};
