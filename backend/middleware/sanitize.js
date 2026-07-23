const sanitizeValue = value => {
    if (typeof value === 'string') {
        return value.replace(/[<>]/g, '').trim();
    }
    if (Array.isArray(value)) return value.map(sanitizeValue);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value)
            .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
            .map(([key, item]) => [key, sanitizeValue(item)]));
    }
    return value;
};

const sanitizeRequest = (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    next();
};

module.exports = { sanitizeRequest };
