const z = require('zod');
const { rejesterUser } = require('../DataStorage/userManagement/saveUser');

const validateBody = (req) => {
    const body = req.body;
    if (!body) throw new Error('Register has no body')
    console.log(req.body)
    const schema = 
        z.object({
            nameField: z.string(),
            nickNameField: z.string(),
            password1: z.string(),
            password2: z.string().optional()
        })
    schema.parse(body)
}

const register = async (req, res) => {
    try {
        validateBody(req);
        const {
            nameField: name, nickNameField: nickName, password1: password
        } = req.body;
        const { result, message } = await rejesterUser({ name, nickName, password })
        res.body = { result, message: message || 'OK' }
        if (result) return res.status(201).send({ message: 'User registered successfully' })
        return res.status(409).send({message})
    } catch (e) {
        console.log(e)
        return res.redirect('/error')
    }
}

module.exports = { register }
