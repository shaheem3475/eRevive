const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
    // CORS setup
    const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5000,http://localhost:3000')
        .split(',').map(origin => origin.trim()).filter(Boolean);
    app.use(cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Origin not allowed by CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://www.gstatic.com', 'https://unpkg.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com', 'https://unpkg.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
                imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
                connectSrc: ["'self'", 'https://*.googleapis.com', 'https://nominatim.openstreetmap.org'],
                frameSrc: ["'self'", 'https://*.firebaseapp.com']
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    // Rate limit configuration for API routes
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // Limit each IP to 500 requests per window
        message: {
            success: false,
            message: 'Too many requests from this IP. Please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use('/api/', limiter);
};

module.exports = setupSecurity;
