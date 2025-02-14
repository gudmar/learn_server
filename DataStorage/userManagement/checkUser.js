const { getUserByLogin } = require('./utils')
const { checkPassword } = require('./hashPassword')

const checkUser = async(login, password) => {
    const user = await getUserByLogin(login)
    console.log('User', user)
    const doesPasswordMatch = user === undefined ? false : await checkPassword(password, user.password)
    const result = {
        result: doesPasswordMatch,
        message: doesPasswordMatch ? 'OK' : 'Failed to match password or login',
        jwtData: {
            login: user.login,
            name: user.name
        }
    }
    return result
}

module.exports = { checkUser }