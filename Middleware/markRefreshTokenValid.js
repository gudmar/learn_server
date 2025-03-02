const { getJwtFromCookie } = requre('../Functions/getJwtFromCookie.js')
const { validateRefreshJwt } = require('../Functions/validateJWT.js')

const validateRefreshMiddleware = async (req, res, next) => {
    const jwt = getJwtFromCookie(req, 'refresh');
    if (!jwt) {
        req.refreshTokenValid = false
        next()
        return
    }
    const { userExists, isUpToDate } = await validateRefreshJwt(jwt)
    req.refreshTokenValid = userExists && isUpToDate
    next()
}

module.exports = { validateRefreshMiddleware }
