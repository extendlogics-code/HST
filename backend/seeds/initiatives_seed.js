/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('initiatives').del();
  
  await knex('initiatives').insert([
    {
      slug: 'women-empowerment',
      title: "Women Empowerment",
      icon: 'Users',
      location: "Thiruvannamalai",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/women-empowerment/01.jpg']),
      description: "Our projects expand opportunities for women through education, entrepreneurship, and vocational training. We provide women the knowledge and skills to earn an income and lift themselves and their families out of poverty, including through scholarships. In the workplace, we address constraints faced by women entrepreneurs by providing networking opportunities, mentoring, access to information and credit, and business management training.",
      target_group: "Women, Youth & Local Communities",
      key_impact: "Sustainable Income & Better Quality of Life",
      foundation: "Charitable & Social Welfare Mission",
      sort_order: 1,
      is_active: true
    },
    {
      slug: 'skill-training',
      title: "Skill Training & Tech",
      icon: 'BookOpen',
      location: "Tamil Nadu",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/skill-training/01.jpg']),
      description: "We focus on marginalized and dropout youths who can be trained and skilled up with new technology and have effective employability for the sustain of their life. The introduction of new technologies has reduced the demand for unskilled labour and raised the value of advanced skills and competencies. Training presents a prime opportunity to expand the knowledge base and demand for workers with higher-level skills.",
      target_group: "Youth & School Dropouts",
      key_impact: "Technical Skills & Employment",
      foundation: "Education & Technology Focus",
      sort_order: 2,
      is_active: true
    },
    {
      slug: 'socio-env',
      title: "Socio Environment",
      icon: 'Activity',
      location: "Thiruvannamalai",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/socio-env/01.jpg']),
      description: "Investments in health, education, urban infrastructure, financial support for low-income entrepreneurs and projects that reduce regional inequalities. Similarly, we support environmental projects, power efficiency, reforestation, forest handling, forest preservation and efforts to combat deforestation. Our approach is grounded in political ecology, highlighting the importance of equality in access to resources.",
      target_group: "Rural Communities & Environment",
      key_impact: "Environmental Sustainability & Equality",
      foundation: "Ecology & Social Welfare",
      sort_order: 3,
      is_active: true
    },
    {
      slug: 'teach-train',
      title: "Teach and Train",
      icon: 'Activity',
      location: "Rural Villages",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/teach-train/01.jpg']),
      description: "Organizing youth and women to give formal and non-formal education through seminars, lectures, workshops, and training programmes. Ultimately it dreams to educate and empower the whole humanity. We provide functional literacy to illiterate young women and other youths in villages in order to empower them with decision-making capabilities and to make them self-sufficient.",
      target_group: "Illiterate Women & Rural Youth",
      key_impact: "Literacy & Decision Making",
      foundation: "Formal & Non-formal Education",
      sort_order: 4,
      is_active: true
    },
    {
      slug: 'organic-farming',
      title: "Organic Farming",
      icon: 'Sprout',
      location: "Local Districts",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/organic-farming/01.jpg']),
      description: "An Organic farming system solely depends on the use of crop residue, animal manures, green manures, and off-farm organic wastes. Organic food is normally priced 20-30% higher, providing a vital premium for small farmers. Furthermore, since organic fertilizers and pesticides can be produced locally, the yearly costs incurred by the farmer are also low.",
      target_group: "Small Farmers & Local Communities",
      key_impact: "Higher Income & Low Production Costs",
      foundation: "Sustainable Agriculture",
      sort_order: 5,
      is_active: true
    },
    {
      slug: 'health-edu',
      title: "Health Education",
      icon: 'Activity',
      location: "Schools & Communities",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/health-edu/01.jpg']),
      description: "Health education teaches people of all ages about how diet and exercise contribute to a healthy lifestyle. It encourages positive changes in behaviour and lowers the risk of addiction. We have an interactive after-school education program for young people that teaches them to analyse, evaluate, and create media messages—skills that help them make smart choices every day.",
      target_group: "Students & Rural Communities",
      key_impact: "Healthy Lifestyle & Risk Reduction",
      foundation: "Preventive Healthcare",
      sort_order: 6,
      is_active: true
    },
    {
      slug: 'concrete-housing',
      title: "Concrete Housing",
      icon: 'Home',
      location: "Dalit Communities",
      status: "Ongoing",
      images: JSON.stringify(['/assets/images/initiatives/concrete-housing/01.jpg']),
      description: "Building safe concrete houses for Dalits and Narikkuravar communities in partnership with DESWOS Germany to break the cycle of poverty. By replacing inadequate shelters with safe concrete dwellings, we provide stability and security for families who have historically been marginalized. These homes are more than just structures; they represent a foundation for a better future.",
      target_group: "Dalit & Narikkuravar Communities",
      key_impact: "Stability, Security & Poverty Reduction",
      foundation: "Housing & Social Justice",
      sort_order: 7,
      is_active: true
    }
  ]);
};
