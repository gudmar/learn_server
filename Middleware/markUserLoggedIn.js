const cookie = require('cookie')
const { validateAuthorizationJwt } = require('../Functions/validateJWT')

const IS_LOGGED_IN = 'Logged, token valid';
const NO_TOKEN = 'No authentication token';
const NO_USER = 'User does not exist';
const CORRUPTED = 'Token is corrupted'
const REFRESH = 'Not valid authentication token, need refresh';
const LOGGED_OUT = 'User logged out, refresh not valid or missing, no valid authentication'

const markLoggedOutIfNoCookie = (req, res, next) => {
    const stringifiedCookies = req.headers?.cookie
    if (!stringifiedCookies) {
        req.isLoggedIn = NO_TOKEN
        next()
        return
    }
    const cookies = cookie.parse(stringifiedCookies)
    const jwt = cookies?.jwt
    if (!jwt) {
        req.isLoggedIn = NO_TOKEN;
        next()
        return
    }
    // const jwt = cookie.parse(jwtCookie);
    // if (!jwtCookie) {
    //     req.isLoggedIn = NO_TOKEN;
    //     next()
    //     return;
    // }
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
        req.isLoggedIn = IS_LOGGED_IN;
        next();
        return
    }
    if (userExists && !isUpToDate) {
        req.isLoggedIn = REFRESH;
        next();
        return
    }
    if (!userExists) {
        req.isLoggedIn = NO_USER;
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

module.exports = { markUserLoggedIn, CORRUPTED, LOGGED_OUT, IS_LOGGED_IN, REFRESH, NO_TOKEN, NO_USER }
