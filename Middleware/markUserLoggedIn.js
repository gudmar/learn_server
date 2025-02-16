const cookie = require('cookie')
const { validateJwt } = require('../Functions/validateJWT')

const markUserLoggedIn = async (req, res, next) => {
    const stringifiedCookies = req.headers?.cookie
    if (!stringifiedCookies) {
        req.isLoggedIn = false
        return
    }
    const cookies = cookie.parse(stringifiedCookies)
    const jwtCookie = cookies?.jwt
    if (!jwtCookie) {
        req.isLoggedIn = false;
        return
    }
    const jwt = cookie.parse(jwtCookie)?.jwtToken;
    if (!jwtCookie) {
        req.isLoggedIn = false;
        return;
    }
    const isJwtValid = await validateJwt(jwt)
    req.isLoggedIn = isJwtValid
    console.log(`${req.isLoggedIn ? 'User is logged in': 'User is NOT logged in'}`)
    next();
}

module.exports = { markUserLoggedIn }
