const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const donorRoutes = require('./src/routes/donorRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const auditRoutes = require('./src/routes/auditRoutes');
const enquiryRoutes = require('./src/routes/enquiryRoutes');
const applicationWindowRoutes = require('./src/routes/applicationWindowRoutes');
const initiativeRoutes = require('./src/routes/initiativeRoutes');
const websiteRoutes = require('./src/routes/websiteRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve Frontend
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/application-windows', applicationWindowRoutes);
app.use('/api/v1/initiatives', initiativeRoutes);
app.use('/api/v1/website', websiteRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Catch-all for Frontend
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Frontend index.html not found at:', indexPath);
      // If we are in development and not hitting an API, show a helpful message
      if (process.env.NODE_ENV !== 'production') {
        return res.status(404).json({
          message: 'Frontend not found. In development, run the frontend separately with npm run dev.',
          path: indexPath
        });
      }
      res.status(404).send('Frontend not found. Please ensure the frontend is built and located at ' + frontendPath);
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NGO Compliance Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
