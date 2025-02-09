const getBodyAsJson = async (response) => {
    if (response.redirected) window.location = response.url
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
    console.log('Reader result', result)
    return JSON.parse(result)
}

// module.exports = { getBodyAsJson }

