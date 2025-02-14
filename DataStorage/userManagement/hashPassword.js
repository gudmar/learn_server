const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedPasswordWithSalt = await bcrypt.hash(password, salt)
    return { salt, hashedPasswordWithSalt }
}

const checkPassword = async (notEncryptedPassword, encryptedPasswordWithSalt) => {
    const result = await bcrypt.compare(notEncryptedPassword, encryptedPasswordWithSalt)
    return result
}

module.exports = { hashPassword, checkPassword }
