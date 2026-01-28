
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .table('website_about', (table) => {
      table.string('origin_title').defaultTo('Origin of the Organization');
      table.text('origin_content').nullable(); // JSON string or text
      table.string('objectives_title').defaultTo('Main Objectives');
      table.json('objectives').nullable(); // JSON array
      table.string('mission_title').defaultTo('Mission Statement');
      table.text('mission_statement').nullable();
    })
    .then(async () => {
      // Add Impact Stats to website_sections if not exists
      const exists = await knex('website_sections').where({ section_key: 'impact_stats' }).first();
      if (!exists) {
        await knex('website_sections').insert({
          section_key: 'impact_stats',
          name: 'Impact Statistics Section',
          sort_order: 9, // Put it at the end for now
          is_active: true
        });
      }

      // Seed initial data for about page content
      const about = await knex('website_about').first();
      const initialObjectives = [
        "To undertake programs for creation of all round awareness",
        "To undertake welfare activities for socially backward, handicapped, tribal for promotion of their moral, social, educational and physical improvement",
        "To organize capacity building and community organization programs",
        "To arrange for skill development programs especially for women",
        "To organize income generating programs for the poor",
        "To organize education programs for health promotion and for the prevention and control of communicable diseases with specific reference to leprosy, tuberculosis, elephantiasis and sexually transmitted diseases and HIV / AIDS etc",
        "To organize education programs for prevention and control of lifestyle oriented diseases in the rural countryside and in the tribal villages",
        "To organize awareness generation aimed at gender equity and women empowerment",
        "To promote the organization and maintenance of self-help groups through education and motivation of community groups with emphasis on women"
      ];

      const initialOrigin = "Help to Self Help Trust is the result of deliberations and consultations among a few like-minded and community-conscious persons in the project area of the organization.\n\nThe founders of the organization are witness to the deplorable conditions of the poor and downtrodden and have the firm conviction that the root cause of all their miseries is ignorance, illiteracy and the consequent deep-rooted poverty.\n\nIn an effort to make changes in the overall living conditions of people in the rural and tribal villages, they founded the Help to Self Help Trust in 2000.";

      const initialMission = "To undertake programs, projects and activities for the overall development of people and ensure participation of the people in all stages of the development process.";

      if (about) {
        await knex('website_about').where({ id: about.id }).update({
          origin_content: initialOrigin,
          objectives: JSON.stringify(initialObjectives),
          mission_statement: initialMission
        });
      } else {
        await knex('website_about').insert({
          title: 'Fostering a Self-Sustaining Cycle of Change',
          subtitle: 'Our Approach',
          description: 'Our approach is rooted in the belief that true empowerment comes from within the community.',
          origin_content: initialOrigin,
          objectives: JSON.stringify(initialObjectives),
          mission_statement: initialMission
        });
      }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .table('website_about', (table) => {
      table.dropColumn('origin_title');
      table.dropColumn('origin_content');
      table.dropColumn('objectives_title');
      table.dropColumn('objectives');
      table.dropColumn('mission_title');
      table.dropColumn('mission_statement');
    })
    .then(() => {
      return knex('website_sections').where({ section_key: 'impact_stats' }).del();
    });
};
