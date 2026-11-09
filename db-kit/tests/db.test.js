const { startTestDb, stopTestDb, clearTestDb} = require('../index.js');
const mongoose = require('mongoose');
const Book = require('../models/default.model.js');

test('Starts the database', async () => {
    await startTestDb();
    expect(mongoose.connection.readyState).toBe(1);
}, 60000);

test('Saves a valid book and fills in defaults', async () => {
    const book = await Book.create({ title: 'Dune', author: 'Frank Herbert', year: 1965 });

    expect(book._id).toBeDefined();
    expect(book.available).toBe(true);
    expect(book.createdAt).toBeInstanceOf(Date);
});

test('Clears the database', async () => {
    expect(await clearTestDb()).toBe('success');
});

test('Stops the database', async () => {
    await stopTestDb();
    expect(mongoose.connection.readyState).toBe(0);
}, 30000);