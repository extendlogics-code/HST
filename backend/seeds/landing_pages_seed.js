
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('website_landing_page').del();
  
  // Inserts seed entries
  await knex('website_landing_page').insert([
    {
      page_name: 'Winter Relief 2026',
      title: 'Warmth for Every Home',
      subtitle: 'Join our mission to provide blankets and warm clothes to those in need.',
      content: '<h2>Our Winter Mission</h2><p>As the temperatures drop, thousands of families struggle to stay warm. Our Winter Relief initiative aims to distribute 10,000 blankets across northern India.</p><h3>How You Can Help</h3><ul><li>Donate a blanket ($10)</li><li>Volunteer for distribution</li><li>Spread the word</li></ul>',
      slug: 'winter-relief-2026',
      is_active: true,
      sort_order: 1
    },
    {
      page_name: 'Digital Literacy Initiative',
      title: 'Empowering Youth Through Technology',
      subtitle: 'Bridging the digital divide one student at a time.',
      content: '<h2>The Digital Divide</h2><p>In today\'s world, digital literacy is not a luxury—it\'s a necessity. We are setting up 50 computer labs in rural schools.</p><p>Your contribution helps buy hardware and train teachers.</p>',
      slug: 'digital-literacy',
      is_active: true,
      sort_order: 2
    },
    {
      page_name: 'Clean Water Project',
      title: 'Water is Life',
      subtitle: 'Providing sustainable clean water solutions to remote villages.',
      content: '<h2>Pure Water, Better Health</h2><p>Contaminated water is the leading cause of illness in rural communities. We install solar-powered water filtration systems.</p><p>Every $1000 provides clean water for an entire village for 10 years.</p>',
      slug: 'clean-water',
      is_active: false,
      sort_order: 3
    }
  ]);
};
