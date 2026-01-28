const db = require('../config/db');

const auditLogger = async (req, action, entityType = null, entityId = null, meta = null) => {
  try {
    await db('audit_logs').insert({
      actor_user_id: req.user ? req.user.id : null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      meta: meta ? JSON.stringify(meta) : null
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

module.exports = auditLogger;
