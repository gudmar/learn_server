const cookie = require('cookie')
const { validateAuthorizationJwt } = require('../Functions/validateJWT')

const markLoggedOutIfNoCookie = (req, res, next) => {
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
    const jwt = cookie.parse(jwtCookie).jwtToken;
    if (!jwtCookie) {
        req.isLoggedIn = null;
        next()
        return;
    }
    return jwt
}

const refreshToken = async (res) => {
    res.status(498).send({command: 'refresh'})
}

const markUserLoggedIn = async (req, res, next) => {
    if (req.originalUrl === '/refresh-token') {
        next();
        return;
    }
    const jwt = markLoggedOutIfNoCookie(req, res, next);

    if (req.isLoggedIn === null) {
        next();
        return;
    }

    const {login, name, isUpToDate, userExists} = await validateAuthorizationJwt(jwt)
    if (userExists && isUpToDate) {
        req.isLoggedIn = true;
        next();
        return
    }
    if (userExists && !isUpToDate) {
        console.log('REfresh')
        req.isLoggedIn = false;
        req.refreshToken = true;
        // refreshToken(res)
        next();
        return
    }
    if (!userExists) {
        req.isLoggedIn = false;
        next();
        return
    }
    // const {login, name, result} = await validateJwt(jwtCookie)
    req.isLoggedIn = result
    req.userName = name;
    req.userLogin = login;
    console.log(`${req.isLoggedIn ? 'User is logged in': 'User is NOT logged in'}`)
    next();
}

module.exports = { markUserLoggedIn }
