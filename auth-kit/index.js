module.exports = {
  ...require('./utils/bcrypt.js'),
  ...require('./utils/jwt.js'),
  ...require('./controllers/auth.controller.js'),
};