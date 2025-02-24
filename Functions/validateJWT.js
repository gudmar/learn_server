const { checkUser, authenticateUser } = require("../DataStorage/userManagement/checkUser")
const { getJwtFromCookie } = require('./getJwtFromCookie.js')
const jwt = require('jsonwebtoken')

const decodeJwt = async(jwToken, secret) => {
    try {
        const result = await jwt.verify(jwToken, secret)
        return {
            ...result,
            result: true
        }
    } catch(e) {
        console.error(e)
        return {
            result: false, 
            message: 'Token not valid'
        }
    }
}

const decodeAuthorizationToken = (jwToken) => decodeJwt(jwToken, process.env.ACCESS_TOKEN_SECRET)

const decodeRefreshToken = (jwToken) => decodeJwt(jwToken, process.env.REFRESH_TOKEN_SECRET)

const checkIfUserExists = async(decodedToken) => {
    const userData = await authenticateUser(decodedToken.login, decodedToken.password)
    return { ...userData?.jwtData, userExists: true } || {result: false, login: null, name: null}
}

const checkIfUpToDate = (decodedToken) => {
    const validity = decodedToken.validity || 0;
    return validity >= Date.now()
}

const validateToken = async(jwToken, decode) => {
    const decoded = await decode(jwToken);
    if (!decoded.result) return false
    const userValidationResult = await checkIfUserExists(decoded)
    const isUpToDate = checkIfUpToDate(decoded)
    return {
        ...userValidationResult, isUpToDate
    }
}

const validateAuthorizationJwt  = async(jwToken) => 
    validateToken(jwToken, decodeAuthorizationToken)

const validateRefreshJwt = async(jwToken) => validateToken(jwToken, decodeRefreshToken)

module.exports = { 
    validateAuthorizationJwt, 
    validateRefreshJwt 
}
