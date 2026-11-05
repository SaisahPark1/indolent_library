const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect } = require('../../connection');

let server;

async function startTestDb() {
    const uri = process.env.TEST_MONGO_URI;
    if (uri) return connect(uri);
    server = await MongoMemoryServer.create();
    return connect(server.getUri());
}

async function stopTestDb() {
    await disconnect();
    if (server) await server.stop();
}

async function clearTestDb() {
    const { collections } = require('mongoose').connection;
    await Promise.all(Object.values(collections).map(c => c.deleteMany({})));
}

module.exports = { startTestDb, stopTestDb, clearTestDb };