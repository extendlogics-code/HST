/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('application_windows', (table) => {
    table.increments('id').primary();
    table.integer('donor_id').unsigned().references('id').inTable('donors').onDelete('CASCADE');
    table.string('program_name').notNullable();
    table.date('open_date').notNullable();
    table.date('close_date').notNullable();
    table.string('category').notNullable(); // Health, Education, WASH, etc.
    table.text('required_documents'); // Stores documents list as text or JSON
    table.string('submission_method'); // portal/email
    table.string('status').defaultTo('draft'); // draft, ready, submitted, shortlisted, etc.
    table.text('submission_details'); // e.g. portal link or email address
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('application_windows');
};
