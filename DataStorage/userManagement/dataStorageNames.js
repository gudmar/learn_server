const USERS = 'users.json'

const getStoragePath = (storageName) => `./__database__/${storageName}`

module.exports = {
    USERS, getStoragePath
}
