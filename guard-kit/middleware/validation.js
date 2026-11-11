const ApiError = require('../utils/ApiError.js');

const validate = (schema, source = 'body', { partial = false } = {}) => (req, res, next) => {
    const input = req[source] || {};
    const details = [];
    const clean = {};

    for (const [field, rule] of Object.entries(schema)) {
        const v = input[field];
        if (v === undefined || v === null || v === '') {
            if (rule.required && !partial) details.push({ field, message: `${field} is required` });
            continue;
        }
        if (rule.type && typeof v !== rule.type) {
            details.push({ field, message: `${field} must be a ${rule.type}` });
        } else if (rule.minLength && v.length < rule.minLength) {
            details.push({ field, message: `${field} must be at least ${rule.minLength} characters` });
        } else if (rule.min !== undefined && v < rule.min) {
            details.push({ field, message: `${field} must be at least ${rule.min}` });
        } else if (rule.max !== undefined && v > rule.max) {
            details.push({ field, message: `${field} must be at most ${rule.max}` });
        } else {
            clean[field] = v;
        }
    }

    if (details.length) return next(ApiError.validation(details));
    req[source] = clean;   // only whitelisted fields continue on
    next();
};

module.exports = { validate };