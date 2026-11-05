const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'test-secret';

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
const setToken = (t) => localStorage.setItem('token', t);
const getToken = () => localStorage.getItem('token');
const clearToken = () => localStorage.removeItem('token');

module.exports = {signToken, verifyToken, setToken, getToken, clearToken}