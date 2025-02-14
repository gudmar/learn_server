const { get } = require('./dbInterface')
const { getStoragePath, USERS } = require("./dataStorageNames")

const getUserByLogin = async (login) => 
    get(getStoragePath(USERS), (content) => 
            content.find((user) => user.login === login))

module.exports = { getUserByLogin }