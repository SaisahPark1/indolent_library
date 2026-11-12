const MockAdapter = require('axios-mock-adapter');
const { createClient } = require('../index');

function setup(options = {}) {
  const api = createClient({ baseURL: 'http://x/api', ...options });
  return { api, mock: new MockAdapter(api) };
}

test('unwraps the success envelope', async () => {
  const { api, mock } = setup();
  mock.onGet('/items').reply(200, { success: true, data: [1, 2] });
  expect(await api.get('/items')).toEqual([1, 2]);
});

test('POST sends the json body', async () => {
  const { api, mock } = setup();
  mock.onPost('/items').reply(201, { success: true, data: { id: '1' } });
  await api.post('/items', { title: 'Dune' });
  expect(JSON.parse(mock.history.post[0].data)).toEqual({ title: 'Dune' });
});

test('adds the bearer token from getToken', async () => {
  const { api, mock } = setup({ getToken: () => 'abc' });
  mock.onGet('/me').reply(200, { success: true, data: null });
  await api.get('/me');
  expect(mock.history.get[0].headers.Authorization).toBe('Bearer abc');
});

test('error envelope becomes an HttpError with details', async () => {
  const { api, mock } = setup();
  mock.onPost('/items').reply(400, {
    success: false,
    error: { message: 'Validation failed', details: [{ field: 'title', message: 'required' }] },
  });
  await expect(api.post('/items', {})).rejects.toMatchObject({
    name: 'HttpError',
    statusCode: 400,
    message: 'Validation failed',
    details: [{ field: 'title', message: 'required' }],
  });
});

test('204 returns null', async () => {
  const { api, mock } = setup();
  mock.onDelete('/items/1').reply(204);
  expect(await api.delete('/items/1')).toBeNull();
});

test('401 calls onUnauthorized and still throws', async () => {
  const onUnauthorized = jest.fn();
  const { api, mock } = setup({ onUnauthorized });
  mock.onGet('/items').reply(401, { success: false, error: { message: 'Missing token' } });
  await expect(api.get('/items')).rejects.toMatchObject({ statusCode: 401 });
  expect(onUnauthorized).toHaveBeenCalledTimes(1);
});