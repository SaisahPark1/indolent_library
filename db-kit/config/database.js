const { MongoMemoryServer } = require('mongodb-memory-server');
const { connect, disconnect } = require('./connect.js');
const mongoose = require('mongoose');

const fs = require('fs');
const t0 = Date.now();
const log = (msg) => fs.writeSync(2, `[${Date.now() - t0}ms] ${msg}\n`);

async function startTestDb() {
    server = await MongoMemoryServer.create();
    console.log(`server up: ${server.getUri()}`);
    await connect(server.getUri(), {
        serverSelectionTimeoutMS: 5000,
        runtimeAdapters: { os: require('os') },
    });
    console.log(`connected, ${mongoose.connection.readyState}`);
}

async function stopTestDb() {
    await mongoose.connection.close(true);
    await server.stop({ doCleanup: false, force: true });
    log('database closed');
}

async function clearTestDb() {
    const { collections } = require('mongoose').connection;
    await Promise.all(Object.values(collections).map(c => c.deleteMany({})));
    return "success"
}

module.exports = { startTestDb, stopTestDb, clearTestDb};