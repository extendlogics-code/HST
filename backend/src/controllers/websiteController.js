const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// Helper for generic CRUD operations
const createController = (tableName, entityName) => ({
  // Public: Get all active items
  getAll: async (req, res) => {
    try {
      const items = await db(tableName)
        .where('is_active', true)
        .orderBy('sort_order', 'asc');
      res.json({ success: true, data: items });
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  // Admin: Get all items
  getAllAdmin: async (req, res) => {
    try {
      const items = await db(tableName).orderBy('sort_order', 'asc');
      res.json({ success: true, data: items });
    } catch (error) {
      console.error(`Error fetching ${tableName} for admin:`, error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  // Admin: Create item
  create: async (req, res) => {
    try {
      const [id] = await db(tableName).insert(req.body);
      const newItem = await db(tableName).where({ id }).first();
      await auditLogger(req, `CREATE_${entityName}`, tableName, id, req.body);
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      console.error(`Error creating ${tableName}:`, error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  // Admin: Update item
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Remove fields that should not be updated
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      const updated = await db(tableName)
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      const updatedItem = await db(tableName).where({ id }).first();
      await auditLogger(req, `UPDATE_${entityName}`, tableName, id, updateData);
      res.json({ success: true, data: updatedItem });
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  // Admin: Delete item
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db(tableName).where({ id }).del();
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
      await auditLogger(req, `DELETE_${entityName}`, tableName, id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
});

exports.impactStatsController = createController('impact_stats', 'IMPACT_STAT');
exports.partnersController = createController('partners', 'PARTNER');
exports.heroSlidesController = createController('hero_slides', 'HERO_SLIDE');

// Donate Page Content
exports.donateController = {
  get: async (req, res) => {
    try {
      const data = await db('website_donate').first();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching donate data:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },

  update: async (req, res) => {
    try {
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      // Ensure JSON fields are handled correctly
      if (updateData.local_bank_details && typeof updateData.local_bank_details === 'object') {
        updateData.local_bank_details = JSON.stringify(updateData.local_bank_details);
      }
      if (updateData.fcra_bank_details && typeof updateData.fcra_bank_details === 'object') {
        updateData.fcra_bank_details = JSON.stringify(updateData.fcra_bank_details);
      }

      await db('website_donate')
        .update({
          ...updateData,
          updated_at: db.fn.now()
        });

      const updated = await db('website_donate').first();
      await auditLogger(req, 'UPDATE_WEBSITE_DONATE', 'website_donate', updated.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating donate data:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

// Sections management (visibility and order)
exports.sectionsController = {
  getAll: async (req, res) => {
    try {
      const items = await db('website_sections').orderBy('sort_order', 'asc');
      res.json({ success: true, data: items });
    } catch (error) {
      console.error('Error fetching website sections:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      await db('website_sections').where({ id }).update({
        ...updateData,
        updated_at: db.fn.now()
      });
      const updated = await db('website_sections').where({ id }).first();
      await auditLogger(req, 'UPDATE_WEBSITE_SECTION', 'website_sections', id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website section:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  reorder: async (req, res) => {
    try {
      const { orders } = req.body; // Array of {id, sort_order}
      await db.transaction(async (trx) => {
        for (const item of orders) {
          await trx('website_sections').where({ id: item.id }).update({ sort_order: item.sort_order });
        }
      });
      await auditLogger(req, 'REORDER_WEBSITE_SECTIONS', 'website_sections', null, req.body);
      res.json({ success: true, message: 'Reordered successfully' });
    } catch (error) {
      console.error('Error reordering website sections:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.aboutController = {
  get: async (req, res) => {
    try {
      const item = await db('website_about').first();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Error fetching website about:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const existing = await db('website_about').first();
      const updateData = {
        ...req.body,
        features: req.body.features ? (typeof req.body.features === 'string' ? req.body.features : JSON.stringify(req.body.features)) : null,
        objectives: req.body.objectives ? (typeof req.body.objectives === 'string' ? req.body.objectives : JSON.stringify(req.body.objectives)) : null,
        images: req.body.images ? (typeof req.body.images === 'string' ? req.body.images : JSON.stringify(req.body.images)) : null,
        updated_at: db.fn.now()
      };

      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (existing) {
        await db('website_about').where({ id: existing.id }).update(updateData);
      } else {
        await db('website_about').insert(updateData);
      }
      const updated = await db('website_about').first();
      await auditLogger(req, 'UPDATE_WEBSITE_ABOUT', 'website_about', updated?.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website about:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.causesController = createController('website_causes', 'CAUSE');
exports.newsController = createController('website_news', 'NEWS');

exports.legalitiesController = {
  get: async (req, res) => {
    try {
      const item = await db('website_legalities').first();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Error fetching website legalities:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const existing = await db('website_legalities').first();
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (existing) {
        await db('website_legalities').where({ id: existing.id }).update({
          ...updateData,
          updated_at: db.fn.now()
        });
      } else {
        await db('website_legalities').insert(updateData);
      }
      const updated = await db('website_legalities').first();
      await auditLogger(req, 'UPDATE_WEBSITE_LEGALITIES', 'website_legalities', updated?.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website legalities:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.ctaController = {
  get: async (req, res) => {
    try {
      const item = await db('website_cta').first();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Error fetching website cta:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const existing = await db('website_cta').first();
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (existing) {
        await db('website_cta').where({ id: existing.id }).update({
          ...updateData,
          updated_at: db.fn.now()
        });
      } else {
        await db('website_cta').insert(updateData);
      }
      const updated = await db('website_cta').first();
      await auditLogger(req, 'UPDATE_WEBSITE_CTA', 'website_cta', updated?.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website cta:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.headerController = {
  get: async (req, res) => {
    try {
      const item = await db('website_header').first();
      if (item && item.nav_links) {
        try {
          item.nav_links = JSON.parse(item.nav_links);
        } catch (e) {
          console.error('Error parsing nav_links:', e);
        }
      }
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Error fetching website header:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const existing = await db('website_header').first();
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (updateData.nav_links && typeof updateData.nav_links !== 'string') {
        updateData.nav_links = JSON.stringify(updateData.nav_links);
      }

      if (existing) {
        await db('website_header').where({ id: existing.id }).update({
          ...updateData,
          updated_at: db.fn.now()
        });
      } else {
        await db('website_header').insert(updateData);
      }
      const updated = await db('website_header').first();
      if (updated && updated.nav_links) {
        try {
          updated.nav_links = JSON.parse(updated.nav_links);
        } catch (e) {}
      }
      await auditLogger(req, 'UPDATE_WEBSITE_HEADER', 'website_header', updated?.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website header:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.footerController = {
  get: async (req, res) => {
    try {
      const item = await db('website_footer').first();
      if (item) {
        // Parse JSON fields if they exist
        try {
          if (item.quick_links) item.quick_links = JSON.parse(item.quick_links);
          if (item.email && (item.email.startsWith('[') || item.email.startsWith('{'))) {
            item.email = JSON.parse(item.email);
          }
          if (item.phone && (item.phone.startsWith('[') || item.phone.startsWith('{'))) {
            item.phone = JSON.parse(item.phone);
          }
        } catch (e) {
          console.error('Error parsing footer JSON fields:', e);
        }
      }
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Error fetching website footer:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  },
  update: async (req, res) => {
    try {
      const existing = await db('website_footer').first();
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;

      // Stringify JSON fields
      if (Array.isArray(updateData.quick_links)) {
        updateData.quick_links = JSON.stringify(updateData.quick_links);
      }
      if (Array.isArray(updateData.email)) {
        updateData.email = JSON.stringify(updateData.email);
      }
      if (Array.isArray(updateData.phone)) {
        updateData.phone = JSON.stringify(updateData.phone);
      }

      if (existing) {
        await db('website_footer').where({ id: existing.id }).update({
          ...updateData,
          updated_at: db.fn.now()
        });
      } else {
        await db('website_footer').insert(updateData);
      }
      const updated = await db('website_footer').first();
      
      // Parse back for response
      if (updated) {
        try {
          if (updated.quick_links) updated.quick_links = JSON.parse(updated.quick_links);
          if (updated.email && (updated.email.startsWith('[') || updated.email.startsWith('{'))) {
            updated.email = JSON.parse(updated.email);
          }
          if (updated.phone && (updated.phone.startsWith('[') || updated.phone.startsWith('{'))) {
            updated.phone = JSON.parse(updated.phone);
          }
        } catch (e) {}
      }

      await auditLogger(req, 'UPDATE_WEBSITE_FOOTER', 'website_footer', updated?.id, updateData);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating website footer:', error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
};

exports.initiativesController = createController('initiatives', 'INITIATIVE');
exports.landingPageController = createController('website_landing_page', 'LANDING_PAGE');
