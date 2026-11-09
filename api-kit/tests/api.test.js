const request = require('supertest');
const express = require('express');
const router = require('../routes/books'); // whatever router you're testing

function makeApp() {
    const app = express();
    app.use(express.json());
    app.use('/api/v1/books', router);
    app.use(ApiError);
    return app;
}

test('GET / returns a list', async () => {
    const res = await request(makeApp()).get('/api/v1/books');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
});

test('POST / creates an item', async () => {
    const res = await request(makeApp())
        .post('/api/v1/books')
        .send({ title: 'Dune', author: 'Frank Herbert' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Dune');
});