require('dotenv').config({ override: true });
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const setupSecurity = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeRequest } = require('./middleware/sanitize');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sellRoutes = require('./routes/sellRoutes');
const recycleRoutes = require('./routes/recycleRoutes');
const donateRoutes = require('./routes/donateRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visionRoutes = require('./routes/visionRoutes');

// Initialize database
connectDB();

const app = express();

// Security Middlewares (Helmet, CORS, Rate Limiters)
setupSecurity(app);

// Body Parser with increased limit for base64 file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest);

app.get('/api/config/firebase', (req, res) => {
    const config = {
        apiKey: process.env.FIREBASE_WEB_API_KEY,
        authDomain: process.env.FIREBASE_WEB_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_WEB_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_WEB_APP_ID
    };
    if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        return res.status(503).json({ success: false, message: 'Firebase web configuration is incomplete', errors: [] });
    }
    res.json({ success: true, message: 'Firebase configuration retrieved', data: config });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sell', sellRoutes);
app.use('/api/recycle', recycleRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vision', visionRoutes);

const frontendRoot = path.join(__dirname, '../');
const publicAssets = new Set([
    'styles.css', 'eRevive.png', 'eRevive (1).png', 'google.jpeg', 'reward.jpg', 'R.jpeg',
    'JD-08-1024.webp', 'background.jpg', '1000_F_471605919_A9olxL3r0Iky3LDiEO8qgRf5yvHNawoR.jpg',
    '3d-abstract-gift-box-with-gold-confetti-white-background-3d-rendering-abstract-background_457716-1484.avif',
    'bright-green-recycling-symbol-green_476363-6263.avif',
    'pngtree-chatbot-icon-chat-bot-robot-picture-image_8080841.png',
    'pngtree-people-trow-old-gadget-in-e-waste-bin-picture-image_8357367.png',
    'WhatsApp Image 2025-02-27 at 21.25.54_d5959db5.jpg'
]);

app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(frontendRoot, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(frontendRoot, 'dashboard.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(frontendRoot, 'admin.html')));
app.get('/:asset', (req, res, next) => {
    if (!publicAssets.has(req.params.asset)) return next();
    res.sendFile(path.join(frontendRoot, req.params.asset));
});

app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API route not found', errors: [] }));

// Fallback to index.html for SPA router matches
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`eRevive Full-Stack Node Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
