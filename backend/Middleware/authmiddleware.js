const User = require('../Models/Users');
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('token is not found');
    return res.sendStatus(401);
  }

  const secretKey = 'Iampassinguserpass';

  try {
    jwt.verify(token, secretKey, async (err, user) => {
      if (err || !user.email) {
        console.log('email is missing', { user, token });
        return res.sendStatus(403);
      }
      const result = await User.findOne({
        email: user.email,
      });

      if (!result || result.email != user.email) {
        return res.sendStatus(403);
      }
      req.user = {
        _id: result._id.toString(),
        name: result.name,
        email: result.email,
        createdAt: result.createdAt,
      };
      console.log(req.user);
      next();
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { authenticateToken };
