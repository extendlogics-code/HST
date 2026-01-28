
exports.seed = async function(knex) {
  // Clear existing data
  await knex('website_about').del();

  // Reset auto-increment counters
  await knex.raw('ALTER TABLE website_about AUTO_INCREMENT = 1');

  // Seed website_about
  await knex('website_about').insert([
    {
      title: 'About Help To Self Help Trust',
      subtitle: 'Empowering Communities Since 2000',
      description: 'Help To Self Help Trust (HST) is a non-profit organization dedicated to creating sustainable change. We focus on education, health, and economic empowerment.',
      image_url: '/assets/images/about-hst.jpg',
      experience_years: '25+',
      features: JSON.stringify(['Community Led', 'Sustainable Impact', 'Transparent Operations']),
      button_text: 'Read Our Story',
      button_url: '/about',
      origin_title: 'Origin of the Organization',
      origin_content: 'Help to Self-Help Trust (HST) emerged from a series of thoughtful deliberations and consultations among a group of like-minded, socially responsible, and community-conscious individuals living and working in the project areas of the organization. The founders, through their close engagement with rural and tribal communities, were direct witnesses to the harsh and deplorable living conditions of the poor, marginalized, and downtrodden sections of society.\n\nThey observed that persistent poverty, social exclusion, and vulnerability were deeply rooted in ignorance, illiteracy, lack of awareness, and limited access to opportunities. With a strong conviction that sustainable change could be achieved only by empowering people with knowledge, skills, and collective strength, the founders resolved to act.\n\nIn the year 2000, driven by a commitment to improve the overall living conditions of people in rural and tribal villages, the Help to Self-Help Trust was formally established. Since its inception, the Trust has been working at the grassroots level to promote self-reliance, social awareness, and inclusive development through community-based interventions.',
      mission_title: 'Mission',
      mission_statement: 'To strive for the holistic and sustainable development of people in the service areas of the organization by promoting awareness creation, skill development, leadership building, self-help initiatives, community organization, and income generation activities, enabling individuals and communities to become self-reliant and socially empowered.',
      objectives_title: 'Objectives',
      objectives: JSON.stringify([
        "To undertake programs aimed at the creation of all-round awareness among rural and tribal communities.",
        "To implement welfare activities for socially backward communities, persons with disabilities, and tribal populations, focusing on their moral, social, educational, and physical development.",
        "To organize capacity-building and community organization programs that strengthen collective action and local leadership.",
        "To arrange skill development and vocational training programs, with special emphasis on women and youth, to enhance employability and livelihoods.",
        "To promote and organize income-generating activities for economically disadvantaged families to improve household income and financial security.",
        "To conduct health education programs for the promotion of community health and the prevention and control of communicable diseases, with specific focus on leprosy, tuberculosis, elephantiasis, sexually transmitted diseases, and HIV/AIDS.",
        "To organize awareness and education programs for the prevention and control of lifestyle-related diseases in rural and tribal areas.",
        "To promote gender equity and women empowerment through awareness generation, leadership development, and access to opportunities.",
        "To encourage the formation, strengthening, and sustainability of Self-Help Groups (SHGs) through education, motivation, and community mobilization, with particular emphasis on women-led groups."
      ]),
      founder_name: 'Mr. M. Shankar m.A.,B.Ed.',
      founder_title: 'Founder',
      founder_bio: 'The idea of Help to Self-Help was born from a simple yet powerful realization: lasting change cannot be imposed from outside; it must grow from within individuals and communities.\n\nOver the years, while working closely with rural and tribal communities, we witnessed not only poverty and deprivation, but also a deep sense of helplessness caused by lack of awareness, limited access to education, poor health, and absence of opportunities. We strongly believe that poverty is not merely a shortage of income, but a shortage of choices, confidence, and information.\n\nAt Help to Self-Help Trust, our approach is rooted in the belief that every individual, when provided with the right knowledge, skills, and encouragement, has the potential to transform their own life. Our role is not to create dependency, but to enable people to recognize their strengths, organize themselves, and take responsibility for their own development.\n\nThrough awareness creation, health education, skill development, livelihood support, and community organization, we strive to empower people to move from vulnerability to self-reliance. Special emphasis is placed on women, as empowering women leads to healthier families, stronger communities, and sustainable development.',
      founder_image_url: '/assets/images/founder.jpg',
      founder_quote: 'The journey of Help to Self-Help Trust is guided by the conviction that true empowerment begins with awareness and grows through collective action. When people are supported to help themselves, development becomes sustainable, dignified, and enduring.'
    }
  ]);
};
