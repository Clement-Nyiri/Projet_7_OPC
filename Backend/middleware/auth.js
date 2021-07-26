const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (authHeader) {
            const token = authHeader;
    
            jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
    
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    }