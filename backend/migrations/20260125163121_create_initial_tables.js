/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Users Table
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.enum('role', ['ADMIN', 'STAFF']).defaultTo('STAFF');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_login_at').nullable();
      table.timestamps(true, true);
    })
    // 2. Trust Settings Table (Single Row)
    .createTable('trust_settings', (table) => {
      table.increments('id').primary();
      table.string('trust_name').defaultTo('Help To Self Help Trust');
      table.string('address_line1');
      table.string('address_line2');
      table.string('city');
      table.string('state');
      table.string('pincode');
      table.string('phone');
      table.string('email');
      table.string('pan_number').defaultTo('AAATH4490F');
      table.string('reg_80g_no').defaultTo('AAATH4490FF20218');
      table.string('authorized_signatory_name').defaultTo('Authorized Signatory');
      table.string('authorized_signatory_designation').defaultTo('Managing Trustee');
      table.string('signature_image_url').nullable();
      table.string('seal_image_url').nullable();
      table.string('certificate_prefix').defaultTo('HST-80G');
      table.string('currency').defaultTo('INR');
      table.timestamps(true, true);
    })
    // 3. Donors Table
    .createTable('donors', (table) => {
      table.increments('id').primary();
      table.enum('donor_type', ['INDIVIDUAL', 'COMPANY']).defaultTo('INDIVIDUAL');
      table.string('donor_name').notNullable();
      table.string('email').nullable();
      table.string('phone').nullable();
      table.text('address').nullable();
      table.string('pan').nullable();
      table.timestamps(true, true);
    })
    // 4. Donations Table
    .createTable('donations', (table) => {
      table.increments('id').primary();
      table.integer('donor_id').unsigned().references('id').inTable('donors').onDelete('CASCADE');
      table.decimal('amount', 15, 2).notNullable();
      table.date('donation_date').notNullable();
      table.string('payment_mode').notNullable(); // CASH, CHEQUE, ONLINE, etc.
      table.string('transaction_ref').nullable();
      table.string('bank_name').nullable();
      table.string('purpose').nullable();
      table.text('remarks').nullable();
      table.integer('created_by').unsigned().references('id').inTable('users');
      table.timestamps(true, true);
    })
    // 5. Certificate Counters Table
    .createTable('certificate_counters', (table) => {
      table.integer('year').primary();
      table.integer('last_seq').defaultTo(0);
    })
    // 6. Certificates Table
    .createTable('certificates', (table) => {
      table.increments('id').primary();
      table.integer('donation_id').unsigned().unique().references('id').inTable('donations').onDelete('CASCADE');
      table.string('certificate_no').unique().notNullable();
      table.date('issue_date').notNullable();
      table.string('pdf_url').nullable();
      table.enum('status', ['ISSUED', 'VOIDED']).defaultTo('ISSUED');
      table.text('void_reason').nullable();
      table.integer('issued_by').unsigned().references('id').inTable('users');
      table.timestamp('issued_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    })
    // 7. Audit Logs Table
    .createTable('audit_logs', (table) => {
      table.increments('id').primary();
      table.integer('actor_user_id').unsigned().references('id').inTable('users').nullable();
      table.string('action').notNullable(); // e.g., 'LOGIN', 'CREATE_DONATION', 'VOID_CERTIFICATE'
      table.string('entity_type').nullable(); // e.g., 'donations', 'users'
      table.integer('entity_id').nullable();
      table.string('ip_address').nullable();
      table.string('user_agent').nullable();
      table.json('meta').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('certificates')
    .dropTableIfExists('certificate_counters')
    .dropTableIfExists('donations')
    .dropTableIfExists('donors')
    .dropTableIfExists('trust_settings')
    .dropTableIfExists('users');
};
