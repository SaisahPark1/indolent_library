module.exports = function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';
    let details = err.details || null;

    if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
        statusCode = 401;
        message = 'Invalid or expired token';
    }

    // malformed ObjectId in a path parameter:
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose schema validation failed
    if (err.name === 'ValidationError' && err.errors) {
        statusCode = 400;
        message = 'Validation failed';
        details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    }

    // unique index violated
    if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate values for: ${Object.keys(err.keyValue || {}).join(', ')}`;
    }

    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Malformed JSON in request body';
    }

    if (err.type === 'entity.too.large') {
        statusCode = 413;
        message = 'Request body too large';
    }

    // the server's fault
    if (statusCode >= 500) {
        console.error('[error]', { message: err.message, stack: err.stack });
        message = 'Internal Server Error'
    }

    res.status(statusCode).json({
        success: false,
        error: {
        message,
        ...(details && { details }),
        ...(false),
        },
    });
};