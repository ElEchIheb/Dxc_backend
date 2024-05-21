const db = require('../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const tokenService = require('./tokenService');


const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email }, include: [db.Role] })
      .then(user => {
        if (!user) {
          reject("Invalid credentials.");
        } else if (!user.status) {
          reject("Account is inactive.");
        } else {
          bcrypt.compare(password, user.password)
            .then(same => {
              if (!same) {
                reject("Invalid credentials.");
              } else {
                const accessToken = tokenService.generateAccessToken(user);
                const RefreshToken = tokenService.generateRefreshToken(user);
                let useraccess = { id: user.id, role: user.Role.roleName, username: `${user.firstName} ${user.lastName}`, accesstoken: accessToken };
                resolve([useraccess, { refreshToken: RefreshToken }]);
              }
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
};








const transporter = nodemailer.createTransport({
  service: process.env.service,
  auth: {
    user: process.env.email,
    pass: process.env.pass
  }
});

const mailOptions = (email, newPassword) => {
  return {
    from: process.env.email,
    to: email,
    subject: 'Password Reset',
    text: `Your new password is: ${newPassword} Please change it upon your next login.`
  }
};



const resetPassword = (email) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          reject('Invalid credentials.');
        } else {
          const newPassword = crypto.randomBytes(8).toString('hex');
          bcrypt.hash(newPassword, 10)
            .then(hashedPassword => {
              db.User.update({ password: hashedPassword }, { where: { email } })
                .then(() => {
                  transporter.sendMail(mailOptions(email, newPassword))
                    .then(() => resolve('Password reset ,email sent'))
                    .catch(error => reject(error));
                })
                .catch(error => reject(error));
            })
            .catch(error => reject(error));
        }
      })
      .catch(error => reject(error));
  });
};



module.exports = { signIn, resetPassword };
