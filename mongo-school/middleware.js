const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateWithJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ 'error': 'Login required to access this route' });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, function (err, payload) {
        if (err) {
            return res.status(400).json({ 'error': err });
        }
        req.payload = payload;
        next();
    });
}

module.exports = { authenticateWithJWT };
