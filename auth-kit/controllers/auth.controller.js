const {hashPassword, verifyPassword} = require('../utils/bcrypt.js')
const { signToken } = require('../utils/jwt.js');
const USERS_KEY = 'users';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return []; // corrupted or missing data
    }
}

async function register({email, password}) {
    const users = getUsers();
    const normalized = String(email).toLowerCase().trim();
    if (users.some(u => u.email === normalized)) return null;
    const user = { email: normalized, password: await hashPassword(password), role: "user"};
    users.push(user);
    saveUsers(users);
    return user;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function login({ email, password }) {
    const normalized = String(email).toLowerCase().trim();
    const user = getUsers().find(u => u.email === normalized);

    if (!user || !(await verifyPassword(password, user.password))) {
        return null;
    }

    return signToken({ email: user.email, role: user.role });
}

module.exports = {login, register, getUsers, saveUsers}