const User = require('../models/User');
const { admin, firebaseApp } = require('../config/firebase');

const verifyJWT = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
        }

        if (!firebaseApp) {
            return res.status(503).json({ success: false, message: 'Authentication service is not configured', errors: [] });
        }

        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        if (!uid || !email) {
            return res.status(401).json({ success: false, message: 'Verified token is missing a user identity', errors: [] });
        }

        let user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                fullName: name || email.split('@')[0],
                email,
                profileImage: picture || '',
                ecoPoints: 500,
                currentTier: 'Silver',
                role: 'User'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        res.status(401).json({ success: false, message: 'Not authorized, token validation failed' });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ success: false, message: 'Admin access required', errors: [] });
    }
    next();
};

const verifyRecycler = (req, res, next) => {
    if (!['Recycler', 'Admin'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Recycler access required', errors: [] });
    }
    next();
};

module.exports = { verifyJWT, verifyAdmin, verifyRecycler, protect: verifyJWT };
