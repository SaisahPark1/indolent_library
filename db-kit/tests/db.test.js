const { startTestDb, stopTestDb, clearTestDb } = require('../index.js');

beforeAll(startTestDb);
afterAll(stopTestDb);
afterEach(clearTestDb);