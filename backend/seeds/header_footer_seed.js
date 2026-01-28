
exports.seed = async function(knex) {
  // Clear existing data
  await knex('website_header').del();
  await knex('website_footer').del();

  // Seed website_header
  await knex('website_header').insert({
    logo_url: '/assets/images/hstlogo.svg',
    nav_links: JSON.stringify([
      { name: 'Home', path: 'home' },
      { 
        name: 'About Us', 
        path: 'about-us',
        dropdown: [
          { name: 'Read Our Story', path: '/about' },
          { name: 'Legal Information', path: '/legal' }
        ]
      },
      { name: 'Causes', path: 'causes' },
      { name: 'Partners', path: 'partners' },
      { 
        name: 'Initiatives', 
        path: '/initiatives' 
      },
      { name: 'Contact', path: '/contact' }
    ])
  });

  // Seed website_footer
  await knex('website_footer').insert({
    logo_url: '/assets/images/hstlogoonly.svg',
    about_text: 'Help To Self Help Trust (HST) is a non-profit organization committed to empowering individuals and communities through education, health, and sustainable development initiatives.',
    facebook_url: 'https://facebook.com/helptoselfhelptrust',
    twitter_url: 'https://twitter.com/hstindia',
    instagram_url: 'https://instagram.com/hstindia',
    linkedin_url: '',
    quick_links: JSON.stringify([
      { label: 'Our History', url: '/about' },
      { label: 'Current Causes', url: '/#causes' },
      { label: 'Become Volunteer', url: '/contact' },
      { label: 'Latest News', url: '/#news' }
    ]),
    address: 'Chetpet, Thiruvannamalai - 606801, Tamil Nadu, India.',
    email: JSON.stringify(['contact@helptoselfhelptrust.org']),
    phone: JSON.stringify(['+91 98650 86296', '+91 87540 60638']),
    copyright_text: '© 2026 Help To Self Help Trust. All rights reserved.'
  });
};
