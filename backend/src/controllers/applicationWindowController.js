const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// @desc    Get all application windows
// @route   GET /api/v1/application-windows
// @access  Private
exports.getApplicationWindows = async (req, res) => {
  try {
    const windows = await db('application_windows')
      .leftJoin('donors', 'application_windows.donor_id', 'donors.id')
      .select('application_windows.*', 'donors.donor_name as donor_name')
      .orderBy('application_windows.created_at', 'desc');
    res.json({ success: true, data: windows });
  } catch (error) {
    console.error('Get Application Windows Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create application window
// @route   POST /api/v1/application-windows
// @access  Private
exports.createApplicationWindow = async (req, res) => {
  try {
    const { 
      donor_id, program_name, open_date, close_date, category,
      required_documents, submission_method, status, submission_details
    } = req.body;

    const windowData = {
      donor_id, program_name, open_date, close_date, category,
      required_documents, submission_method, status, submission_details
    };

    // Convert empty strings to null for optional fields and remove undefined
    Object.keys(windowData).forEach(key => {
      if (windowData[key] === '' || windowData[key] === undefined) {
        windowData[key] = null;
      }
    });

    const [id] = await db('application_windows').insert(windowData);
    const window = await db('application_windows').where({ id }).first();
    
    await auditLogger(req, 'CREATE_APPLICATION_WINDOW', 'application_windows', id, windowData);
    
    res.status(201).json({ success: true, data: window });
  } catch (error) {
    console.error('Create Application Window Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get application window by ID
// @route   GET /api/v1/application-windows/:id
// @access  Private
exports.getApplicationWindow = async (req, res) => {
  try {
    const window = await db('application_windows')
      .leftJoin('donors', 'application_windows.donor_id', 'donors.id')
      .select('application_windows.*', 'donors.donor_name as donor_name')
      .where('application_windows.id', req.params.id)
      .first();
    if (!window) return res.status(404).json({ success: false, error: 'Application window not found' });
    res.json({ success: true, data: window });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update application window
// @route   PATCH /api/v1/application-windows/:id
// @access  Private
exports.updateApplicationWindow = async (req, res) => {
  try {
    const { 
      donor_id, program_name, open_date, close_date, category,
      required_documents, submission_method, status, submission_details
    } = req.body;

    const updateData = {
      donor_id, program_name, open_date, close_date, category,
      required_documents, submission_method, status, submission_details,
      updated_at: db.fn.now()
    };

    // Convert empty strings to null for optional fields and remove undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === undefined) {
        updateData[key] = null;
      }
    });

    const updated = await db('application_windows')
      .where({ id: req.params.id })
      .update(updateData);

    if (!updated) return res.status(404).json({ success: false, error: 'Application window not found' });

    const window = await db('application_windows').where({ id: req.params.id }).first();
    await auditLogger(req, 'UPDATE_APPLICATION_WINDOW', 'application_windows', req.params.id, updateData);
    
    res.json({ success: true, data: window });
  } catch (error) {
    console.error('Update Application Window Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete application window
// @route   DELETE /api/v1/application-windows/:id
// @access  Private
exports.deleteApplicationWindow = async (req, res) => {
  try {
    const deleted = await db('application_windows').where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ success: false, error: 'Application window not found' });
    
    await auditLogger(req, 'DELETE_APPLICATION_WINDOW', 'application_windows', req.params.id, null);
    
    res.json({ success: true, message: 'Application window deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
