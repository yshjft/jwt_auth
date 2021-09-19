const jwt = require("jsonwebtoken");
const getToken = require('../utils/jwt')

exports.checkAccessToken = (req, res, next) => {
    const token = getToken(req)

    if(!token) {
        return res.status(400).json({message: "wrong token format or token is not sended"})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
        if(error) return res.status(403).json({message: error.message})

        req.user = user
        next()
    })
}