const cookie = require('cookie')
const { validateJwt } = require('../Functions/validateJWT')

const markUserLoggedIn = async (req, res, next) => {
    const stringifiedCookies = req.headers?.cookie
    if (!stringifiedCookies) {
        req.isLoggedIn = null
        next()
        return
    }
    const cookies = cookie.parse(stringifiedCookies)
    const jwtCookie = cookies?.jwt
    if (!jwtCookie) {
        req.isLoggedIn = null;
        next()
        return
    }
    const jwt = cookie.parse(jwtCookie)?.jwtToken;
    if (!jwtCookie) {
        req.isLoggedIn = null;
        next()
        return;
    }
    const {login, name, result} = await validateJwt(jwt)
    req.isLoggedIn = result
    req.userName = name;
    req.userLogin = login;
    console.log(`${req.isLoggedIn ? 'User is logged in': 'User is NOT logged in'}`)
    next();
}

module.exports = { markUserLoggedIn }
