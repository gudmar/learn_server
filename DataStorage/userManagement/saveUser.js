const { getStoragePath, USERS } = require("./dataStorageNames")
const { add } = require('./dbInterface')

const getUserByLogin = async(login) => (user) => user.login === login

const rejesterUser = async ({ name, nickName, password }) => {
    const path = getStoragePath(USERS);
    const user = { name, login: nickName, password }
    const userWithTheSameLogin = await getUserByLogin(nickName)(user)
    console.log(userWithTheSameLogin)
    if (userWithTheSameLogin !== undefined) {
        return {
            result: false,
            message: `Login ${nickName} already taken`
        }
    }
    await add(path, user)
    return { result: true }
}

module.exports = { rejesterUser }
