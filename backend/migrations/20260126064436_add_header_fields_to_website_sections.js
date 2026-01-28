
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('website_sections', (table) => {
    table.string('subtitle').nullable();
    table.string('title').nullable();
    table.text('description').nullable();
  }).then(() => {
    // Seed some initial data for the sections to match current hardcoded content
    const updates = [
      {
        section_key: 'about',
        subtitle: 'Our Approach',
        title: 'Fostering a Self-Sustaining Cycle of Change',
        description: 'Our approach is rooted in the belief that true empowerment comes from within the community.'
      },
      {
        section_key: 'legalities',
        subtitle: 'Official Compliance',
        title: 'Trust Legalities',
        description: ''
      },
      {
        section_key: 'causes',
        subtitle: 'Recent Causes',
        title: 'Our Latest Causes',
        description: 'Invest in the future by supporting our ongoing initiatives for a better world.'
      },
      {
        section_key: 'initiatives',
        subtitle: 'Empowering Communities',
        title: 'Our Core Programmes',
        description: ''
      },
      {
        section_key: 'partners',
        subtitle: 'Our Network',
        title: 'Trusted by Partners',
        description: ''
      },
      {
        section_key: 'news',
        subtitle: 'Latest Updates',
        title: 'News & Articles',
        description: 'Stay updated with our latest activities and stories of impact.'
      }
    ];

    return Promise.all(updates.map(u => 
      knex('website_sections')
        .where({ section_key: u.section_key })
        .update({
          subtitle: u.subtitle,
          title: u.title,
          description: u.description
        })
    ));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('website_sections', (table) => {
    table.dropColumn('subtitle');
    table.dropColumn('title');
    table.dropColumn('description');
  });
};
