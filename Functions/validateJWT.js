const { checkUser, authenticateUser } = require("../DataStorage/userManagement/checkUser")
const jwt = require('jsonwebtoken')

const decodeJwt = async(jwToken) => {
    try {
        const result = await jwt.verify(jwToken, process.env.ACCESS_TOKEN_SECRET)
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

const validateJwt = async(jwToken) => {
    const decoded = await decodeJwt(jwToken);
    if (!decoded.result) return false
    // const userData = await checkUser(decoded.login, decoded.password)
    const userData = await authenticateUser(decoded.login, decoded.password)
    return { ...userData?.jwtData, result: true } || {result: false, login: null, name: null}
}

module.exports = { validateJwt }
