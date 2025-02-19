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
    return JSON.parse(result)
}

const setDefaultValues = (defaults) => {
    Object.entries(fieldNameToIdMap).forEach(([key, id]) => {
        const element = document.getElementById(id);
        element.value = defaults[key]
    })
    Object.entries(fieldNameToIdMap).forEach(([key, id]) => {
        const element = document.getElementById(id);
    })
}

const getFormFieldValues = (fieldNameToIdMap) => {
    values = Object.entries(fieldNameToIdMap).reduce(
        (acc, [fieldName, id]) => {
            const element = document.getElementById(id);
            acc[fieldName] = element.value
            return acc
        }, {}
    )
    return values
}

const getUrl = (endpoint) => `${window.location.origin}/${endpoint}`

const getInformationField = (id) => document.getElementById(id)

const showError = (destinationId, message, errorClass) => {
    const informationField = getInformationField(destinationId);
    informationField.classList.add(errorClass || 'forms-error')
    informationField.innerHTML = message
}

const showSuccess = (destinationId, message, successClass) => {
    const informationField = getInformationField(destinationId);
    informationField.classList.add(successClass || 'forms-success')
    informationField.innerHTML = message
}

const doWithIncommingMessage = async (response) => {
    const body = await getBodyAsJson(response);
    const command = body.command;
    const commandToActionMap = {
        'reload': () => window.location.reload(),
        'refreshJWT': async() => {
            const response = await fetch(
                getUrl('/refresh'),
                { method: 'POST' }
            )
        }
    }
    console.log(body)
    if (command) {
        await commandToActionMap[command]()
    } else {
        console.log('Command not found')
    }
}
