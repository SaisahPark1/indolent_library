const mongoose = require('mongoose');

async function connect(uri = process.env.MONGO_URI, options = {}) {
  if (!uri) throw new Error('MONGO_URI is not set');
  if (mongoose.connection.readyState === 1) return mongoose.connection; // already connected
  await mongoose.connect(uri, options);
  return mongoose.connection;
}

// const disconnect = () => mongoose.disconnect();
const disconnect = () => mongoose.connection.close(true);

module.exports = { connect, disconnect };