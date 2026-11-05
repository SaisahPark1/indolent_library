const bcrypt = require('bcryptjs');

const hashPassword = (plain, rounds = 12) => bcrypt.hash(plain, rounds);
const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = {hashPassword, verifyPassword}