
exports.seed = async function(knex) {
  // Clear existing data
  await knex('website_about').del();
  await knex('website_causes').del();
  await knex('website_news').del();
  await knex('website_cta').del();

  // Reset auto-increment counters
  await knex.raw('ALTER TABLE website_about AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE website_causes AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE website_news AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE website_cta AUTO_INCREMENT = 1');

  // Seed website_about
  await knex('website_about').insert([
    {
      title: 'About Help To Self Help Trust',
      subtitle: 'Empowering Communities Since 2000',
      description: 'Help To Self Help Trust (HST) is a non-profit organization dedicated to creating sustainable change. We focus on education, health, and economic empowerment.',
      image_url: '/assets/images/about-hst.jpg',
      images: JSON.stringify([
        '/assets/images/about-hst.jpg',
        '/assets/images/women-empowerment.jpg',
        '/assets/images/organic-farming.jpg',
        '/assets/images/concrete-housing.jpg'
      ]),
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
      founder_name: 'Mr. M. Shankar',
      founder_degree: 'M.A.,B.Ed.',
      founder_title: 'Founder',
      founder_bio: 'The idea of Help to Self-Help was born from a simple yet powerful realization: lasting change cannot be imposed from outside; it must grow from within individuals and communities.\n\nOver the years, while working closely with rural and tribal communities, we witnessed not only poverty and deprivation, but also a deep sense of helplessness caused by lack of awareness, limited access to education, poor health, and absence of opportunities. We strongly believe that poverty is not merely a shortage of income, but a shortage of choices, confidence, and information.\n\nAt Help to Self-Help Trust, our approach is rooted in the belief that every individual, when provided with the right knowledge, skills, and encouragement, has the potential to transform their own life. Our role is not to create dependency, but to enable people to recognize their strengths, organize themselves, and take responsibility for their own development.\n\nThrough awareness creation, health education, skill development, livelihood support, and community organization, we strive to empower people to move from vulnerability to self-reliance. Special emphasis is placed on women, as empowering women leads to healthier families, stronger communities, and sustainable development.\n\nThe journey of Help to Self-Help Trust is guided by the conviction that true empowerment begins with awareness and grows through collective action. When people are supported to help themselves, development becomes sustainable, dignified, and enduring.\n\nWe remain committed to walking alongside communities as partners in progress, nurturing confidence, resilience, and hope for a better future.',
      founder_image_url: '/uploads/website/founder-1769450846923-266099458.png',
      founder_quote: 'People do not need charity alone; they need opportunity, awareness, and the confidence to shape their own future.',
      trustee_name: 'Mr. Vivek Shankar',
      trustee_degree: 'B.E',
      trustee_title: 'Managing Trustee',
      trustee_message: 'The vision of Help to Self-Help Trust was built on a simple belief shared by our founder: people do not need charity alone; they need opportunity, awareness, and the confidence to shape their own future. As the current Managing Trustee, and as a young leader, I consider it my responsibility to carry this vision forward in a way that responds to today’s realities.\n\nThe challenges faced by communities have evolved. Health risks, unemployment, lack of skills, and limited access to information continue to affect people’s lives, especially women and youth. At the same time, new opportunities exist through education, technology, and community collaboration. Our focus is to bridge this gap by combining the founder’s grassroots approach with practical, modern solutions that deliver measurable impact.\n\nWe believe in action that is transparent, accountable, and outcome-driven. Every program we design aims to create real change on the ground, not short-term relief. By empowering individuals to help themselves, we build stronger families and more resilient communities.\n\nAs we move forward, Help to Self-Help Trust remains committed to evolving with the times while staying true to its core purpose: enabling people to become confident, capable, and self-reliant.',
      trustee_image: '/uploads/website/trustee-1769450851836-189733564.png'
    }
  ]);

  // Seed website_causes
  await knex('website_causes').insert([
    {
      title: 'Child Care and Education Development Programme',
      description: 'Supporting the holistic growth of children through early childhood care, access to quality education, learning support, and value-based development.',
      raised_amount: 0,
      goal_amount: 10000,
      image_url: '/assets/images/teach-train.jpg',
      category: 'Education',
      sort_order: 1,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Rural Women Empowerment Programme',
      description: 'Empowering rural women through education, skill development, livelihood support, leadership training, and awareness of rights and entitlements.',
      raised_amount: 0,
      goal_amount: 15000,
      image_url: '/assets/images/women-empowerment.jpg',
      category: 'Empowerment',
      sort_order: 2,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Skill Training for Adolescents',
      description: 'Providing vocational and life-skill training to adolescent boys and girls to enhance employability, self-confidence, and future career opportunities.',
      raised_amount: 0,
      goal_amount: 12000,
      image_url: '/assets/images/teach-train.jpg',
      category: 'Skills',
      sort_order: 3,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Environmental Education and Development Programme',
      description: 'Promoting environmental awareness, conservation practices, tree plantation, waste management, and sustainable living at the community level.',
      raised_amount: 0,
      goal_amount: 8000,
      image_url: '/assets/images/socio-env.jpg',
      category: 'Environment',
      sort_order: 4,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Health Education, Health Camps, and Kitchen Garden Programme',
      description: 'Improving community health through health education, preventive care, regular health camps, hygiene awareness, and promotion of household kitchen gardens for better nutrition.',
      raised_amount: 0,
      goal_amount: 10000,
      image_url: '/assets/images/health-education.jpg',
      category: 'Health',
      sort_order: 5,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Water Management and Sanitation Programme',
      description: 'Addressing water scarcity and public health challenges through water conservation, rainwater harvesting, sanitation infrastructure, and hygiene awareness initiatives.',
      raised_amount: 0,
      goal_amount: 20000,
      image_url: '/assets/images/socio-env.jpg',
      category: 'Sanitation',
      sort_order: 6,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Promotion of Organic Farming for Farmers',
      description: 'Encouraging sustainable agriculture by training farmers in organic farming practices, soil health management, and eco-friendly cultivation methods.',
      raised_amount: 0,
      goal_amount: 10000,
      image_url: '/assets/images/socio-env.jpg',
      category: 'Agriculture',
      sort_order: 7,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Widows and Destitute Care Programme',
      description: 'Providing social, economic, and emotional support to widows and destitute women through livelihood assistance, welfare access, and rehabilitation initiatives.',
      raised_amount: 0,
      goal_amount: 15000,
      image_url: '/assets/images/women-empowerment.jpg',
      category: 'Social Welfare',
      sort_order: 8,
      is_active: true,
      show_progress: false
    },
    {
      title: 'Aged Care Programme',
      description: 'Ensuring dignity, care, and well-being of elderly persons through health support, social inclusion, regular medical check-ups, and community-based care services.',
      raised_amount: 0,
      goal_amount: 12000,
      image_url: '/assets/images/health-education.jpg',
      category: 'Social Welfare',
      sort_order: 9,
      is_active: true,
      show_progress: false
    }
  ]);

  // Seed website_news
  await knex('website_news').insert([
    {
      title: 'HST Receives Excellence Award',
      content: 'We are proud to announce that HST has been recognized for its outstanding contribution to rural development.',
      excerpt: 'HST recognized for rural development excellence in 2025.',
      author: 'Admin',
      publish_date: '2025-12-01',
      image_url: '/assets/images/hero-bg.jpg',
      sort_order: 1,
      is_active: true
    },
    {
      title: 'New Health Camp in Chetpet',
      content: 'A free health check-up camp was organized for the residents of Chetpet and surrounding villages.',
      excerpt: 'Free health check-up camp organized for local residents.',
      author: 'Medical Team',
      publish_date: '2026-01-15',
      image_url: '/assets/images/health-education.jpg',
      sort_order: 2,
      is_active: true
    }
  ]);

  // Seed website_cta
  await knex('website_cta').insert([
    {
      title: 'Ready to Make a Difference?',
      description: 'Join our team of volunteers and help us create a better future for those in need.',
      button_text: 'Become a Volunteer',
      button_url: '/contact',
      background_type: 'gradient',
      background_value: '#0d9488'
    }
  ]);
};
