const { getJwtFromCookie } = requre('../Functions/getJwtFromCookie.js')
const { validateRefreshJwt } = require('../Functions/validateJWT.js')

const validateRefreshMiddleware = (req, res, next) => {
    const jwt = getJwtFromCookie(req, 'refresh');
    if (!jwt) {
        req.refreshTokenValid = false
        next()
        return
    }
    const { userExists, isUpToDate } = validateRefreshJwt(jwt)
    req.refreshTokenValid = userExists && isUpToDate
    next()
}

module.exports = { validateRefreshMiddleware }
