const db = require('../config/db');

// @desc    Get all audit logs
// @route   GET /api/v1/audit-logs
// @access  Private (Admin Only)
exports.getAuditLogs = async (req, res) => {
  const { action, actor_user_id, entity_type, start_date, end_date, limit = 50, offset = 0 } = req.query;

  try {
    let query = db('audit_logs')
      .leftJoin('users', 'audit_logs.actor_user_id', 'users.id')
      .select(
        'audit_logs.*',
        'users.name as actor_name',
        'users.email as actor_email'
      )
      .orderBy('audit_logs.created_at', 'desc');

    if (action) query = query.where('audit_logs.action', action);
    if (actor_user_id) query = query.where('audit_logs.actor_user_id', actor_user_id);
    if (entity_type) query = query.where('audit_logs.entity_type', entity_type);
    
    if (start_date) {
      query = query.where('audit_logs.created_at', '>=', start_date);
    }
    if (end_date) {
      query = query.where('audit_logs.created_at', '<=', `${end_date} 23:59:59`);
    }

    const logs = await query.limit(limit).offset(offset);
    
    // Get total count for pagination
    const countQuery = db('audit_logs');
    if (action) countQuery.where('action', action);
    if (actor_user_id) countQuery.where('actor_user_id', actor_user_id);
    if (entity_type) countQuery.where('entity_type', entity_type);
    const [{ count }] = await countQuery.count('id as count');

    res.json({
      success: true,
      data: logs,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
