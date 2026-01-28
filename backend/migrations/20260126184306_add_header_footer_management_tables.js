/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('website_header', (table) => {
      table.increments('id').primary();
      table.string('logo_url').nullable();
      table.string('announcement_text').nullable();
      table.string('announcement_link').nullable();
      table.boolean('show_announcement').defaultTo(true);
      table.string('contact_email').nullable();
      table.string('contact_phone').nullable();
      table.timestamps(true, true);
    })
    .createTable('website_footer', (table) => {
      table.increments('id').primary();
      table.string('logo_url').nullable();
      table.text('about_text').nullable();
      table.string('copyright_text').nullable();
      table.string('facebook_url').nullable();
      table.string('twitter_url').nullable();
      table.string('instagram_url').nullable();
      table.string('linkedin_url').nullable();
      table.string('address').nullable();
      table.string('email').nullable();
      table.string('phone').nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      return knex('website_header').insert({
        announcement_text: 'Support our mission - Your contribution makes a difference!',
        contact_email: 'contact@helptoselfhelptrust.org',
        contact_phone: '+91 98650 86296'
      });
    })
    .then(() => {
      return knex('website_footer').insert({
        about_text: 'Help To Self Help Trust (HST) is a non-profit organization committed to empowering individuals and communities through education, health, and sustainable development initiatives.',
        copyright_text: '© 2026 Help To Self Help Trust. All rights reserved.',
        facebook_url: 'https://facebook.com/helptoselfhelptrust',
        twitter_url: 'https://twitter.com/hstindia',
        instagram_url: 'https://instagram.com/hstindia',
        address: 'No, 9/1 Annai Theresa Street, Nirmala Nagar, Chetpet, Thiruvannamalai - 606801',
        email: 'contact@helptoselfhelptrust.org',
        phone: '+91 98650 86296, +91 87540 60638'
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('website_footer')
    .dropTableIfExists('website_header');
};
