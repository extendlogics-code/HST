const knex = require('knex')(require('./knexfile').development);
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets/images');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function syncImages() {
  try {
    console.log('Starting image synchronization...');

    // 1. Sync Initiatives
    const initiatives = await knex('initiatives').select('id', 'slug');
    for (const initiative of initiatives) {
      const slug = initiative.slug;
      const assetPath = path.join(ASSETS_DIR, 'initiatives', slug, '01.jpg');
      const uploadRelDir = path.join('initiatives', slug);
      const uploadDir = path.join(UPLOADS_DIR, uploadRelDir);
      const uploadPath = path.join(uploadDir, '01.jpg');

      if (fs.existsSync(assetPath)) {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.copyFileSync(assetPath, uploadPath);
        
        const dbPath = `/uploads/initiatives/${slug}/01.jpg`;
        await knex('initiatives')
          .where('id', initiative.id)
          .update({
            images: JSON.stringify([dbPath])
          });
        console.log(`Updated initiative ${slug} with ${dbPath}`);
      } else {
        // Fallback to flat structure if nested doesn't exist
        const flatAssetPath = path.join(ASSETS_DIR, `${slug}.jpg`);
        if (fs.existsSync(flatAssetPath)) {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          fs.copyFileSync(flatAssetPath, uploadPath);
          const dbPath = `/uploads/initiatives/${slug}/01.jpg`;
          await knex('initiatives')
            .where('id', initiative.id)
            .update({
              images: JSON.stringify([dbPath])
            });
          console.log(`Updated initiative ${slug} (flat) with ${dbPath}`);
        }
      }
    }

    // 2. Sync About Us
    const aboutAsset = path.join(ASSETS_DIR, 'about-hst.jpg');
    if (fs.existsSync(aboutAsset)) {
      const uploadPath = path.join(UPLOADS_DIR, 'website', 'about-hst.jpg');
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.copyFileSync(aboutAsset, uploadPath);
      
      const dbPath = '/uploads/website/about-hst.jpg';
      await knex('website_about')
        .update({
          images: JSON.stringify([dbPath])
        });
      console.log(`Updated website_about with ${dbPath}`);
    }

    // 3. Sync Hero Slides
    const heroAsset = path.join(ASSETS_DIR, 'hero-bg.jpg');
    if (fs.existsSync(heroAsset)) {
      const uploadPath = path.join(UPLOADS_DIR, 'website', 'hero-bg.jpg');
      fs.copyFileSync(heroAsset, uploadPath);
      
      const dbPath = '/uploads/website/hero-bg.jpg';
      await knex('hero_slides')
        .where('sort_order', 1)
        .update({
          image_url: dbPath
        });
      console.log(`Updated hero_slide 1 with ${dbPath}`);
    }

    // 4. Sync Logo
    const logoAsset = path.join(ASSETS_DIR, 'hstlogo.svg');
    if (fs.existsSync(logoAsset)) {
      const uploadPath = path.join(UPLOADS_DIR, 'website', 'hstlogo.svg');
      fs.copyFileSync(logoAsset, uploadPath);
      console.log(`Synced logo to ${uploadPath}`);
    }

    console.log('Synchronization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during synchronization:', error);
    process.exit(1);
  }
}

syncImages();
