const db = require('../config/db');
const UAParser = require('ua-parser-js');

/**
 * @desc    Track a website visit
 * @route   POST /api/v1/analytics/track
 * @access  Public
 */
exports.trackVisit = async (req, res) => {
  const { path, referer } = req.body;
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  try {
    await db('visitor_logs').insert({
      ip_address: ip,
      user_agent: userAgent,
      path: path || '/',
      referer: referer || '',
      device_type: result.device.type || 'desktop',
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      // city and country could be added here using a geoip service
      created_at: db.fn.now()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Don't fail the request if tracking fails
    res.json({ success: false });
  }
};

/**
 * @desc    Get website analytics
 * @route   GET /api/v1/analytics/stats
 * @access  Private (Admin Only)
 */
exports.getAnalytics = async (req, res) => {
  const { range = '30d' } = req.query;
  
  try {
    let dateLimit;
    const now = new Date();
    if (range === '30d') {
      dateLimit = new Date(now.setDate(now.getDate() - 30));
    } else if (range === '90d') {
      dateLimit = new Date(now.setDate(now.getDate() - 90));
    } else {
      dateLimit = new Date(0); // All time
    }

    const query = db('visitor_logs').where('created_at', '>=', dateLimit);

    // Total Visits
    const [{ count: totalVisits }] = await query.clone().count('id as count');

    // Unique Visitors (by IP)
    const [{ count: uniqueVisitors }] = await query.clone().countDistinct('ip_address as count');

    // Devices breakdown
    const devices = await query.clone()
      .select('device_type as type')
      .count('id as count')
      .groupBy('device_type');

    // OS breakdown
    const os = await query.clone()
      .select('os as name')
      .count('id as count')
      .groupBy('os')
      .orderBy('count', 'desc')
      .limit(5);

    // Browsers breakdown
    const browsers = await query.clone()
      .select('browser as name')
      .count('id as count')
      .groupBy('browser')
      .orderBy('count', 'desc')
      .limit(5);

    // Top Pages
    const topPages = await query.clone()
      .select('path')
      .count('id as count')
      .groupBy('path')
      .orderBy('count', 'desc')
      .limit(10);

    // Recent Visitors
    const recentVisitors = await query.clone()
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(50);

    res.json({
      success: true,
      data: {
        totalVisits: parseInt(totalVisits),
        uniqueVisitors: parseInt(uniqueVisitors),
        devices,
        os,
        browsers,
        topPages,
        recentVisitors,
        timeRange: range
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
