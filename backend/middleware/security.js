const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
    // CORS setup supporting local dev, FRONTEND_ORIGINS, and Vercel domains
    const defaultAllowed = [
        'http://localhost:5000',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:5000'
    ];
    const envAllowed = (process.env.FRONTEND_ORIGINS || '')
        .split(',').map(o => o.trim()).filter(Boolean);
    const allowedOrigins = Array.from(new Set([...defaultAllowed, ...envAllowed]));

    app.use(cors({
        origin(origin, callback) {
            // Allow server-to-server / same-origin requests (origin === undefined)
            if (!origin) return callback(null, true);
            // Allow exact origin matches or any Vercel deployment origin
            if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            return callback(new Error('Origin not allowed by CORS policy'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://www.gstatic.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
                imgSrc: ["'self'", 'data:', 'https:', 'http:', 'blob:'],
                connectSrc: ["'self'", 'https:', 'http:', 'wss:'],
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
