const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const verifyToken = (req, res, next) => {

    let token = req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {

        token = token.slice(7);
    } else {
        return res.status(403).json({
            message: "NO token provided!"
        });
    }

    jwt.verify(token, config.ACCESS_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }

        req.userRole = decoded.role;
        req.userId=decoded.id;

        next();
    });
};

module.exports = {
    verifyToken
};
