const axios = require('axios');

class HttpError extends Error {
  constructor(statusCode, message, details = null, body = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode; // 0 = network failure or timeout
    this.details = details;
    this.body = body;
  }
}

function createClient({ baseURL = '', getToken, onUnauthorized, timeout = 10000 } = {}) {
  const http = axios.create({ baseURL, timeout, headers: { Accept: 'application/json' } });

  // add the token to every request, but never send it to an absolute URL
  http.interceptors.request.use(async (config) => {
    const absolute = /^https?:\/\//i.test(config.url || '');
    const token = !absolute && getToken ? await getToken() : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  http.interceptors.response.use(
    (res) => {
      const body = res.data;
      if (res.status === 204 || body === '' || body == null) return null;
      if (body.success === true && 'data' in body) return body.data; // unwrap the envelope
      return body;
    },
    (err) => {
      if (!err.response) {
        const timedOut = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT';
        throw new HttpError(0, timedOut ? 'Request timed out' : 'Network error');
      }
      const { status, data, statusText } = err.response;
      if (status === 401 && onUnauthorized) onUnauthorized();
      const apiError = data && data.error;
      throw new HttpError(
        status,
        (apiError && apiError.message) || statusText || `Request failed (${status})`,
        (apiError && apiError.details) || null,
        data
      );
    }
  );

  return http; // use it as api.get / api.post / api.patch / api.delete
}

module.exports = { createClient, HttpError };