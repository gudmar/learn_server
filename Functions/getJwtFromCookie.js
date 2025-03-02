const getJwtFromCookie = (req, tokenName) => {
    const stringifiedCookies = req.headers?.cookie
    if (!stringifiedCookies) return null
    return cookie.parse(stringifiedCookies)?.[tokenName] || null
}

module.exports = {getJwtFromCookie}
