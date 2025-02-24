const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const getJWT = (data) => jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
const getRefreshToken = (data) => jwt.sign(data, process.env.REFRESH_TOKEN_SECRET)

const getTokenLifePeriod = () => Date.now() + 1000 * 60 // min

const getRefreshTokenLifePeriod = () => Date.now() + 1000 * 60 * 2 // 2 min

const getMortalJWT = (data) => getJWT({...data, validity: getTokenLifePeriod()})

const getMortalRefreshToken = (data) => getRefreshToken({...data, validity: getRefreshTokenLifePeriod()})

const getRefreshTokenCookie = (data) => cookie.serialize(
    'refreshToken', getMortalRefreshToken(data),
    {
        secure: true,
        httpOnly: true,
    }
)

const getJWTCookie = (data) => cookie.serialize(
    'jwtToken',
    getMortalJWT(data),
    {
        secure: true,
        // httpOnly: true,
    }
)

module.exports = { getJWT, getJWTCookie, getRefreshTokenCookie }
