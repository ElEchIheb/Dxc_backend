const config = require('../config/auth.config');
const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.firstName, role: user.Role.roleName }, config.ACCESS_KEY, { expiresIn: "1h" })
}

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.firstName, role: user.Role.roleName }, config.REFRESH_KEY, { expiresIn: "7d" })
}

const refreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, config.REFRESH_KEY, (err, decoded) => {
      if (err) {
        reject("Refresh token is invalid");
      } else {
        const user = { id: decoded.id, firstName: decoded.username, Role: { roleName: decoded.role } };
        const newAccessToken = generateAccessToken(user);
        resolve({ accessToken: newAccessToken });
      }
    });
  });
};





module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshToken
}
