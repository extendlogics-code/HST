
const knex = require('knex')(require('./knexfile').development);

async function cleanup() {
  console.log('Starting database image URL cleanup...');
  
  const tables = [
    { name: 'hero_slides', columns: ['image_url'] },
    { name: 'website_about', columns: ['image_url', 'founder_image_url', 'trustee_image_url', 'images'] },
    { name: 'initiatives', columns: ['images'] },
    { name: 'impact_stats', columns: ['icon'] },
    { name: 'partners', columns: ['logo_url'] },
    { name: 'website_causes', columns: ['image_url'] },
    { name: 'website_news', columns: ['image_url'] },
    { name: 'website_cta', columns: ['image_url'] },
    { name: 'website_landing_page', columns: ['image_url'] }
  ];

  try {
    for (const table of tables) {
      const exists = await knex.schema.hasTable(table.name);
      if (!exists) {
        console.log(`Skipping table: ${table.name} (does not exist)`);
        continue;
      }

      console.log(`Processing table: ${table.name}`);
      const rows = await knex(table.name).select('*');
      
      for (const row of rows) {
        let updated = false;
        const updateData = {};
        
        for (const col of table.columns) {
          if (row[col]) {
            if (typeof row[col] === 'string' && row[col].includes('localhost:5000')) {
              const oldUrl = row[col];
              const newUrl = oldUrl.replace(/http:\/\/localhost:5000\//g, '');
              updateData[col] = newUrl;
              updated = true;
              console.log(`  Updating ${table.name} (ID: ${row.id}) column ${col}: ${oldUrl} -> ${newUrl}`);
            } else if (Array.isArray(row[col])) {
              // Handle JSON arrays (like in initiatives table)
              const newArray = row[col].map(item => 
                (typeof item === 'string' && item.includes('localhost:5000')) 
                  ? item.replace(/http:\/\/localhost:5000\//g, '') 
                  : item
              );
              if (JSON.stringify(newArray) !== JSON.stringify(row[col])) {
                updateData[col] = JSON.stringify(newArray);
                updated = true;
                console.log(`  Updating ${table.name} (ID: ${row.id}) column ${col} (Array)`);
              }
            }
          }
        }
        
        if (updated) {
          await knex(table.name).where('id', row.id).update(updateData);
        }
      }
    }
    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    await knex.destroy();
  }
}

cleanup();
