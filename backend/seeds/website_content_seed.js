
exports.seed = async function(knex) {
  // Clear existing data
  await knex('hero_slides').del();
  await knex('website_sections').del();
  await knex('impact_stats').del();

  // Reset website_sections (important for rendering flow)
  await knex('website_sections').insert([
    { section_key: 'hero', name: 'Hero Section', sort_order: 1, is_active: true },
    { section_key: 'about', name: 'About Us Section', sort_order: 2, is_active: true },
    { section_key: 'legalities', name: 'Legalities Section', sort_order: 3, is_active: true },
    { section_key: 'causes', name: 'Causes Section', sort_order: 4, is_active: true },
    { section_key: 'initiatives', name: 'Initiatives Section', sort_order: 5, is_active: true },
    { section_key: 'partners', name: 'Partners Section', sort_order: 6, is_active: true },
    { section_key: 'cta', name: 'Volunteer CTA Section', sort_order: 7, is_active: true },
    { section_key: 'news', name: 'News & Articles Section', sort_order: 8, is_active: true },
    { section_key: 'impact_stats', name: 'Impact Stats Section', sort_order: 1.5, is_active: true }
  ]);

  // Seed hero_slides
  await knex('hero_slides').insert([
    {
      title: 'Self Reliance & Growth',
      subtitle: 'Create a cycle of positive change',
      description: 'We believe true empowerment comes from within. Equipping individuals with the tools and confidence they need to succeed and contribute back to their communities.',
      image_url: '/assets/images/hero-bg.jpg',
      button_text: 'Join Us',
      button_url: '/contact',
      sort_order: 1,
      is_active: true
    },
    {
      title: 'Empowering Women',
      subtitle: 'Strength in Unity',
      description: 'Supporting women through self-help groups and skill development to achieve financial independence and social equality.',
      image_url: '/assets/images/women-empowerment.jpg',
      button_text: 'Learn More',
      button_url: '/about',
      sort_order: 2,
      is_active: true
    }
  ]);

  // Seed impact_stats
  await knex('impact_stats').insert([
    { label: 'Families Impacted', value: '10,000+', icon: 'Users', sort_order: 1, is_active: true },
    { label: 'Women Empowered', value: '5,000+', icon: 'Heart', sort_order: 2, is_active: true },
    { label: 'Children Educated', value: '2,500+', icon: 'GraduationCap', sort_order: 3, is_active: true },
    { label: 'Projects Completed', value: '150+', icon: 'Target', sort_order: 4, is_active: true }
  ]);
};
