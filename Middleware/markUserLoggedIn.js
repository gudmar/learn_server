const cookie = require('cookie')
const { validateAuthorizationJwt } = require('../Functions/validateJWT');
const { logVerboose } = require('../getLoggingOptions');
// const { getJwtFromCookie } = require('../Functions/getJwtFromCookie');  // REMOVE THIS FILE
const { getAuthenticationToken } = require('../Functions/getFromRequest')

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
        return next()
    }
    const cookies = cookie.parse(stringifiedCookies)
    const jwt = cookies?.jwt
    if (!jwt) {
        req.isLoggedIn = NO_TOKEN;
        return next()
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
    if (['/refresh-token'].includes(req.originalUrl) ) {
        // return next();
    }



    // if ('/login' === req.originalUrl && req.method === 'POST') {
    //     return next();
    // }
    // const jwt = markLoggedOutIfNoCookie(req, res, next); // THIS causes serious problems, this should not be in a separeate function
    // or it makes response backed in some way


    const stringifiedCookies = req.headers?.cookie
    if (!stringifiedCookies) {
        req.isLoggedIn = NO_TOKEN
        return next()
    }
    const jwt = getAuthenticationToken(req);
    if (!jwt) {
        req.isLoggedIn = NO_TOKEN;
        return next()
    }

    if (req.isLoggedIn === null) {
        return next();
    }

    const {login, name, isUpToDate, userExists} = await validateAuthorizationJwt(jwt)
    if (userExists && !isUpToDate) {
        req.isLoggedIn = REFRESH;
        return next();
    }
    if (!userExists) {
        req.isLoggedIn = NO_USER;
        logVerboose('User does not exist')
        return next();
    }
    // const {login, name, result} = await validateJwt(jwtCookie)
    // req.isLoggedIn = result
    req.userName = name;
    req.userLogin = login;

    if (userExists && isUpToDate) {
        req.isLoggedIn = IS_LOGGED_IN;
        return next();
    }
    console.log(`${req.isLoggedIn ? 'User is logged in': 'User is NOT logged in'}`)
    return next();
}

module.exports = { markUserLoggedIn, CORRUPTED, LOGGED_OUT, IS_LOGGED_IN, REFRESH, NO_TOKEN, NO_USER }
