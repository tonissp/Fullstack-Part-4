const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });
    const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordCorrect) {
      return response.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).json({
      token,
      username: user.username,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = loginRouter;