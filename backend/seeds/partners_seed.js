/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in partners table
  await knex('partners').del();
  
  await knex('partners').insert([
    {
      name: 'Hope for Children Uk',
      logo_url: '/assets/images/logo.png', // Placeholder since specific logos weren't provided
      website_url: null,
      category: 'Donor Agency',
      sort_order: 1,
      is_active: true
    },
    {
      name: 'Arbeitskreis Austria',
      logo_url: 'https://cdn-icons-png.flaticon.com/512/10543/10543343.png',
      website_url: null,
      category: 'Donor Agency',
      sort_order: 2,
      is_active: true
    },
    {
      name: 'Ministry of Auyish and family welfare, New Delhi',
      logo_url: '/assets/images/logo.png',
      website_url: null,
      category: 'Donor Agency',
      sort_order: 3,
      is_active: true
    },
    {
      name: 'Development Promotion Group Chennai',
      logo_url: '/assets/images/logo.png',
      website_url: null,
      category: 'Donor Agency',
      sort_order: 4,
      is_active: true
    },
    {
      name: 'Soest Netherland',
      logo_url: '/assets/images/logo.png',
      website_url: null,
      category: 'Donor Agency',
      sort_order: 5,
      is_active: true
    }
  ]);
};
