const {login, register} = require('../index.js');

test('returns a token for valid credentials', async () => {
    await register({ email: 'hello@gmail.com', password: '1234567890' });
    const token = await login({ email: 'hello@gmail.com', password: '1234567890' });
    expect(typeof token).toBe('string');
});

test('returns null for an existing email', async () => {
    expect(await register({ email: 'hello@gmail.com', password: '1234567890' })).toBeNull();
});

test('returns null for a wrong password', async () => {
    expect(await login({ email: 'hello@gmail.com', password: 'nope' })).toBeNull();
});

test('returns null for an unknown email', async () => {
    expect(await login({ email: 'nobody@gmail.com', password: 'x' })).toBeNull();
});