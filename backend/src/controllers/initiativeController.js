const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

exports.getInitiatives = async (req, res) => {
  try {
    const initiatives = await db('initiatives')
      .where('is_active', true)
      .orderBy('sort_order', 'asc');
    
    // Parse JSON images
    const parsedInitiatives = initiatives.map(item => ({
      ...item,
      images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
    }));

    res.json({ success: true, data: parsedInitiatives });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getAllInitiativesAdmin = async (req, res) => {
  try {
    const initiatives = await db('initiatives').orderBy('sort_order', 'asc');
    
    const parsedInitiatives = initiatives.map(item => ({
      ...item,
      images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
    }));

    res.json({ success: true, data: parsedInitiatives });
  } catch (error) {
    console.error('Error fetching initiatives for admin:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createInitiative = async (req, res) => {
  try {
    const { images, ...initiativeData } = req.body;
    
    if (images) {
      initiativeData.images = JSON.stringify(images);
    }

    const [id] = await db('initiatives').insert(initiativeData);
    const newInitiative = await db('initiatives').where({ id }).first();

    await auditLogger(req, 'CREATE_INITIATIVE', 'initiatives', id, req.body);

    res.status(201).json({ success: true, data: newInitiative });
  } catch (error) {
    console.error('Error creating initiative:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, ...initiativeData } = req.body;

    // Remove fields that should not be updated
    delete initiativeData.id;
    delete initiativeData.created_at;
    delete initiativeData.updated_at;

    if (images) {
      initiativeData.images = JSON.stringify(images);
    }

    const updated = await db('initiatives')
      .where({ id })
      .update({
        ...initiativeData,
        updated_at: db.fn.now()
      });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Initiative not found' });
    }

    const updatedInitiative = await db('initiatives').where({ id }).first();
    await auditLogger(req, 'UPDATE_INITIATIVE', 'initiatives', id, req.body);

    res.json({ success: true, data: updatedInitiative });
  } catch (error) {
    console.error('Error updating initiative:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('initiatives').where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Initiative not found' });
    }

    await auditLogger(req, 'DELETE_INITIATIVE', 'initiatives', id);

    res.json({ success: true, message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.uploadInitiativeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/initiatives/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error uploading initiative image:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
