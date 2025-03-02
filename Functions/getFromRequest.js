const { logVerboose } = require("../getLoggingOptions")
const cookie = require('cookie')

const getParsedCookies = (req) => {
    const cookies = req.headers?.cookie
    if(!cookies) {
        logVerboose('Cookie in getParsedCookies is not defined', cookie);
        return {}
    }
    const result = cookie.parse(cookies);
    return result
}

const getParsedToken = (req, tokenName) => {
    const token = getParsedCookies(req)
    if (!token) return null;
    logVerboose('Parsing token', token)
    // const result = cookie.parse(token)[tokenName];
    const parsedTokens = cookie.parse(token[tokenName])
    logVerboose('Later', parsedTokens)
    return parsedTokens[`${tokenName}Token`];
}

// const getRefreshTokenFromRequest = (req) => {
//     const token = getParsedCookies(req)
//     if (!token) return null;
//     logVerboose('Parsing token', token)
//     const result = cookie.parse(token)['refreshToken'];
//     return result;
// }
const getRefreshTokenFromRequest = (req) => getParsedToken(req, 'refresh')
const getAuthenticationToken = (req) => getParsedToken(req, 'jwt')

module.exports = { getParsedCookies, getRefreshTokenFromRequest, getAuthenticationToken }
