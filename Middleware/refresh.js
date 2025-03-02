const { logVerboose } = require("../getLoggingOptions");
const { REFRESH } = require("./markUserLoggedIn")

const refresh = (req, res, next) => {
    const needsRefresh = req.isLoggedIn === REFRESH;
    logVerboose('Needs refresh', needsRefresh, req.isLoggedIn, REFRESH)
    const {method, url} = req;
    if (!needsRefresh) { return next() }
    else {
        const body = {
            originalRequest: { method, url },
            refreshNeeded: true,
        }
        req.app.set('originalMethod', req.method)
        res.body = JSON.stringify(body);
        res.redirect('/refresh-token')
    }
}

module.exports = {refresh}
