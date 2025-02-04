const { getStoragePath, USERS } = require("./dataStorageNames")
const { add } = require('./dbInterface')

const rejesterUser = async ({ name, nickName, password }) => {
    const path = getStoragePath(USERS);
    const user = { name, login: nickName, password }
    await add(path, user)
}

module.exports = { rejesterUser }
