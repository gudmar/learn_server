const z = require('zod');
const { checkUser } = require('../DataStorage/userManagement/checkUser');
const { getJWTCookie, getRefreshTokenCookie } = require('../Functions/getJWT');

const validateBody = (req) => {
    const body = req.body;
    if (!body) throw new Error('Login request has no body')
    const schema = 
        z.object({
            login: z.string(),
            password: z.string(),
        })
    schema.parse(body)
}

const handleLogin = async (req, res) => {
    validateBody(req)
    const { result, message, jwtData } = await checkUser(req.body.login, req.body.password)
    if (result) {
        console.log('User exists')
        const jwt = getJWTCookie(jwtData)
        const refreshToken = getRefreshTokenCookie(jwtData)
        return res.status(200)
            .cookie('jwt', jwt, {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
                // maxAge: 1000
            })
            .cookie('refresh', refreshToken, {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
                // maxAge: 1000
            })
            .send({
                result: true,
                message: 'OK',
                command: 'reload'
                // jwt
            })
    }
    return res.status(401).send({ result: false, message: 'User not authenticated' })
}

module.exports = { handleLogin }
