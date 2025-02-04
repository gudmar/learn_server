// import { z } from 'zod';
const z = require('zod');
const { rejesterUser } = require('../DataStorage/userManagement/saveUser');

const validateBody = (req) => {
    const body = req.body;
    if (!body) throw new Error('Register has no body')
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
        const outcome = await rejesterUser({ name, nickName, password })
        res.body = { outcome }
        if (outcome) return res.status(201).send('Success')
        return res.status(500).send('Failure')
    } catch (e) {
        return res.redirect('/error')
    }
}


module.exports = { register }