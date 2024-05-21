const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

const login = (req, res) => {
  authService.signIn(req.body.data.email, req.body.data.password)
    .then(data => { res.status(200).json(data); })

    .catch(err => { res.status(400).json({ "msg": err }); });
};





const forgot_password = (req, res) => {
  const { email } = req.body;
  authService.resetPassword(email)
    .then(message => { res.status(200).json({ "msg": message }); })

    .catch(err => { res.status(400).json({ "msg": err }); });
};




const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ errmsg: "Access Denied" });

  tokenService.refreshToken(refreshToken)
    .then(data => { res.status(200).json(data); })

    .catch(err => { res.status(400).json({ "msg": err }); });
};


module.exports = { login, forgot_password, refreshToken };
