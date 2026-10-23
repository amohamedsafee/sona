const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file hosting
app.use('/uploads', express.static(config.uploadDir));
app.use('/admin', express.static(config.adminStaticDir));

// Also host main template assets so admin panel can use them directly
app.use('/css', express.static(path.join(config.frontendStaticDir, 'css')));
app.use('/js', express.static(path.join(config.frontendStaticDir, 'js')));
app.use('/img', express.static(path.join(config.frontendStaticDir, 'img')));
app.use('/fonts', express.static(path.join(config.frontendStaticDir, 'fonts')));

// Serve public website files
app.use(express.static(config.frontendStaticDir));

// Route Registrations
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomsRoutes'));
app.use('/api/bookings', require('./routes/bookingsRoutes'));
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/blogs', require('./routes/blogsRoutes'));
app.use('/api/testimonials', require('./routes/testimonialsRoutes'));
app.use('/api/messages', require('./routes/messagesRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Sona Luxury Hotel API & Admin Backend',
    timestamp: new Date().toISOString()
  });
});

// Root redirects or defaults
app.get('/admin', (req, res) => {
  res.sendFile(path.join(config.adminStaticDir, 'index.html'));
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Sona Luxury Hotel Backend Server`);
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` Admin Panel URL:   http://localhost:${PORT}/admin/`);
  console.log(` Website Homepage:  http://localhost:${PORT}/index.html`);
  console.log(` API Endpoint:      http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
