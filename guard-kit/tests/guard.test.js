const errorHandler = require('../middleware/errorHandler');
const ApiError = require('../utils/ApiError');

function run(err, { headersSent = false } = {}) {
    const res = { headersSent, status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    errorHandler(err, {}, res, next);
    return { res, next, body: res.json.mock.calls[0]?.[0] };
}

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {})); // quiet the 5xx logs
afterEach(() => { jest.restoreAllMocks(); process.env.NODE_ENV = 'test'; });

test('ApiError keeps its status and message', () => {
    const { res, body } = run(ApiError.notFound('Item not found'));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(body).toEqual({ success: false, error: { message: 'Item not found' } });
});

test('CastError becomes a 400', () => {
    const err = Object.assign(new Error('x'), { name: 'CastError', path: '_id', value: 'abc' });
    const { res, body } = run(err);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(body.error.message).toBe('Invalid _id: abc');
});

test('Mongoose ValidationError becomes a 400 with details', () => {
    const err = Object.assign(new Error('x'), {
        name: 'ValidationError',
        errors: { title: { path: 'title', message: 'Path `title` is required.' } },
    });
    const { res, body } = run(err);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(body.error.details).toEqual([{ field: 'title', message: 'Path `title` is required.' }]);
});

test('duplicate key becomes a 409', () => {
    const err = Object.assign(new Error('dup'), { code: 11000, keyValue: { email: 'a@b.com' } });
    const { res, body } = run(err);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(body.error.message).toBe('Duplicate values for: email');
});

test('too-large body is a 413', () => {
    const { res } = run(Object.assign(new Error('big'), { type: 'entity.too.large' }));
    expect(res.status).toHaveBeenCalledWith(413);
});

test('unknown errors are a 500', () => {
    const { res, body } = run(new Error('db password is hunter2'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(body.error.message).toBe('Internal Server Error');
    expect(body.error.stack).toBeUndefined();
});