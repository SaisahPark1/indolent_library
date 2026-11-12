/**
 * @jest-environment jsdom
 */
const {login, register} = require('../index.js');

test('returns a token for valid credentials', async () => {
    await register({ email: 'hello@gmail.com', password: '1234567890' });
    const token = await login({ email: 'hello@gmail.com', password: '1234567890' });
    expect(typeof token).toBe('string');
});

test('returns error for an existing email', async () => {
    await expect(
        register({ email: 'hello@gmail.com', password: '1234567890' })
    ).rejects.toMatchObject({ statusCode: 409 });
});

test('returns error for a wrong password', async () => {
    await expect(login({ email: 'hello@gmail.com', password: 'nope' })).rejects.toMatchObject({ statusCode: 401 });
});

test('returns error for an unknown email', async () => {
    await expect(login({ email: 'nobody@gmail.com', password: 'x' })).rejects.toMatchObject({ statusCode: 401 });
});