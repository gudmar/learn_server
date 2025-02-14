const z = require('zod');
const { checkUser } = require('../DataStorage/userManagement/checkUser')

const validateBody = (req) => {
    const body = req.body;
    console.log('Body', body)
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
    const { result, message } = await checkUser(req.body.login, req.body.password)
    if (result) {
        console.log('User exists')
        return res.status(200).send({message: 'OK'})
    }
    return res.status(401).send({message: 'User not authenticated'})
}

module.exports = { handleLogin }
