const db = require('../config/db');

// @desc    Create a new enquiry
// @route   POST /api/v1/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, consent } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, email and message' 
      });
    }

    const [enquiryId] = await db('enquiries').insert({
      name,
      email,
      phone,
      subject,
      message,
      consent
    });

    res.status(201).json({
      success: true,
      data: { id: enquiryId },
      message: 'Enquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error in createEnquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error during enquiry submission'
    });
  }
};

// @desc    Get all enquiries
// @route   GET /api/v1/enquiries
// @access  Private (Admin)
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await db('enquiries').orderBy('created_at', 'desc');
    res.json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    console.error('Error in getEnquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error fetching enquiries'
    });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/v1/enquiries/:id
// @access  Private (Admin)
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const count = await db('enquiries').where({ id }).del();
    
    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteEnquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error deleting enquiry'
    });
  }
};

// @desc    Update enquiry status
// @route   PATCH /api/v1/enquiries/:id/status
// @access  Private (Admin)
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const count = await db('enquiries').where({ id }).update({ status });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: { id, status }
    });
  } catch (error) {
    console.error('Error in updateEnquiryStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error updating enquiry status'
    });
  }
};
