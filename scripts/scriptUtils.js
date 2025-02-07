const getBodyAsJson = async (response) => {
    const reader = response.body.getReader()
    let result = ''
    await reader.read().then(function add({done, value}) {
        if (done) return;
        value.forEach((code) => {
            const char = String.fromCharCode(code)
            result += char
        })
        return reader.read().then(add)
    });
    return JSON.parse(result)
}

module.exports = { getBodyAsJson }

