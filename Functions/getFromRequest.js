const { logVerboose } = require("../getLoggingOptions")
const cookie = require('cookie')

const getParsedCookies = (req) => {
    const cookies = req.headers?.cookie
    if(!cookies) {
        return {}
    }
    const result = cookie.parse(cookies);
    return result
}

const getParsedToken = (req, tokenName) => {
    const cookies = getParsedCookies(req)
    if (!cookies) return null;
    const token = cookies[tokenName];
    if (!token) return null;
    // return token
    const parsedTokens = cookie.parse(token)
    return parsedTokens[`${tokenName}Token`];
}

const getAuthenticationToken = (req) => {
    const cookies = getParsedCookies(req)
    if (!cookies) return null;
    const token = cookies.jwt;
    if (!token) return null;
    // return token
    const parsedTokens = cookie.parse(token)
    const result = parsedTokens[`jwtToken`] || token
    return result
}

const getRefreshTokenFromRequest = (req) => {
    const cookies = getParsedCookies(req)
    if (!cookies) return null;
    const token = cookies['refresh'];
    if (!token) return null;
    // return token
    const result = cookie.parse(token)['refreshToken'];
    return result;
}
// const getRefreshTokenFromRequest = (req) => getParsedToken(req, 'refresh')
// const getAuthenticationToken = (req) => getParsedToken(req, 'jwt')

module.exports = { getParsedCookies, getRefreshTokenFromRequest, getAuthenticationToken }
