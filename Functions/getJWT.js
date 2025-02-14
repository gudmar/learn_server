const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const getJWT = (data) => jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)

const getJWTCookie = (data) => cookie.serialize(
    'jwtToken',
    getJWT(data),
    {
        secure: true,
        // httpOnly: true,
    }
)

module.exports = { getJWT, getJWTCookie }
