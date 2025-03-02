const isVerboose = () => process.env.LOGGING === 'verboose'

const logVerboose = (label, data) => {
    if (isVerboose()) console.log(label, data)
}

const isSilent = () => process.env.LOGGING === 'none'

module.exports = {isVerboose, isSilent, logVerboose}
