const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack || err.message);

    if (err.message === 'Origin not allowed by CORS') {
        return res.status(403).json({ success: false, message: err.message, errors: [] });
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Mongoose cast error (invalid Object ID)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Resource not found with invalid id format: ${err.value}`,
            errors: []
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered.',
            errors: []
        });
    }

    // Default fallback
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: []
    });
};

module.exports = errorHandler;
