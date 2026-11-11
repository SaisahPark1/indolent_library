const request = require('supertest');
const express = require('express');
const itemsRouter = require('../controllers/api.controller.js')

// Added to work independently from db-kit
class MemoryRepo {
    constructor() { this.items = []; this.n = 0; }
    async find() { return this.items; }
    async findById(id) { return this.items.find(i => i.id === id) || null; }
    async create(data) { const item = { id: String(++this.n), ...data }; this.items.push(item); return item; }
    async update(id, data) { const item = await this.findById(id); return item ? Object.assign(item, data) : null; }
    async delete(id) {
        const item = await this.findById(id);
        this.items = this.items.filter(i => i.id !== id);
        return item;
    }
}

let firstId = null


const app = express();
app.use(express.json());
app.use('/api/v1/items', itemsRouter(new MemoryRepo()));

test('GET / returns a list', async () => {
    const res = await request(app).get('/api/v1/items');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
});

test('POST / creates an item', async () => {
    const res = await request(app).post('/api/v1/items').send({ title: 'Dune' });
    firstId = res.body.data.id
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Dune');
});

test('PATCH /:id updates an item', async () => {
    const res = await request(app).patch('/api/v1/items/'+firstId).send({ title: 'Not Dune' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Not Dune');
});

test('DELETE / deletes an item', async () => {
    const res = await request(app).delete('/api/v1/items/'+firstId)
    expect(res.status).toBe(204);
});

test('GET /:id with an invalid id', async () => {
    const res = await request(app).get('/api/v1/items/100')
    expect(res.status).toBe(404);
});

test('DELETE /:id with an invalid id', async () => {
    const res = await request(app).delete('/api/v1/items/100')
    expect(res.status).toBe(404);
});