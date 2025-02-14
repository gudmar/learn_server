const bindRegisterScripts = () => {
    const createAccountButton = document.querySelector('.register-create-account');
    createAccountButton.addEventListener('click', submitIfValid);

    setDefaultValues({
        nameField: 'John',
        nickNameField: 'doe-1',
        password1: 'asdf1',
        password2: 'asdf1'
    })
}

const fieldNameToIdMap = {
    nameField: 'register-name',
    nickNameField: 'register-nick-name',
    password1: 'register-password-1',
    password2: 'register-password-2',
}

const getError = (message) => {
    return {
    isValid: false,
    message
}}

const VALID = { isValid: true }

const validateNameField = (value) => {
    const isEmpty = value.trim() === '';
    const startsWithCapital = /^[A-Z][a-z]+$/.test(value)
    if (isEmpty) return getError('Name field cannot be empty')
    if (!startsWithCapital) return getError('Name field should start with a capital letter, and should have at least one lower letter aflterwords. Name is not allowed to have any non word characters, and every letter after the first one shoudl be lowercase.')
    return VALID
}

const validateNickNameField = (value) => {
    const isNotEmpty = value.trim() !== '';
    if (!isNotEmpty) return getError('Nick name cannot be empty');
    const isCorrectPattern = /^[a-zA-Z]+[_-][0-9]*$/.test(value);
    if (!isCorrectPattern) return getError(
        'Nick name should start with any number of letters greater then 0, followed by a single "-" or "_" and any number of digits'
    )
    return VALID
}

const validatePassword = (value) => {
    const isNotEmpty = value.trim() !== '';
    if (!isNotEmpty) return getError('Password cannot be empty');
    const isLengthCorrect = value.length >= 5;
    if (!isLengthCorrect) return getError('Passowrd length should be >= 5')
    const hasMandatorySymbols = /[a-zA-Z][0-9]/.test(value)
    if (!hasMandatorySymbols) return getError('A password should have a letter and a digit')
    return VALID
}

const validatePassowrds = (password1, password2) => {
    if (password1 !== password2) return getError('Password fields do not match');
    return validatePassword(password1);
}

const checkIsFromValid = () => {
    const {
        nameField,
        nickNameField,
        password1,
        password2
    } = getFormFieldValues(fieldNameToIdMap);
    const validationFunctions = [
        () => validateNameField(nameField),
        () => validateNickNameField(nickNameField),
        () => validatePassowrds(password1, password2),
    ]
    let validationMessage = '';
    validationFunctions.find(validationFunction => {
        const {isValid, message} = validationFunction();
        if (!isValid) validationMessage = message
        return !isValid
    })
    console.log(validationMessage)
    if (validationMessage !== '') return getError(validationMessage)
    return VALID
}

const INFORMATION_ID = 'register-user-information'

const clearInformation = () => {
    const informationField = getInformationField(INFORMATION_ID);
    informationField.innerHTML = ''
    [
        ERROR_CLASS, SUCCESS_CLASS
    ].forEach((cssClass) => informationField?.classList?.remove(cssClass))
}

ERROR_CLASS = 'register-error'
SUCCESS_CLASS = 'register-success'

const getForm = () => document.getElementById('register-user-form');


// const getBodyAsJson = async (response) => {
//     const reader = response.body.getReader()
//     let result = ''
//     await reader.read().then(function add({done, value}) {
//         if (done) return;
//         value.forEach((code) => {
//             const char = String.fromCharCode(code)
//             result += char
//         })
//         return reader.read().then(add)
//     });
//     return JSON.parse(result)
// }

const submit = async () => {
    const body = JSON.stringify(getFormFieldValues(fieldNameToIdMap));
    // const body = getFormFieldValues()
    const url = getUrl('register')
    console.log(body)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Content-Type': 'application/json'
        },
        body: body
    })
    const responseBody = await getBodyAsJson(response)
    showError(INFORMATION_ID, responseBody.message, ERROR_CLASS)
}

const submitForm = async () => {
    const form = getForm();
    await form.submit();
}

const submitIfValid = () => {
    const { isValid, message } = checkIsFromValid();
    if (isValid) {
        // submitForm();
        submit();
        showSuccess(INFORMATION_ID, 'User probably registered', SUCCESS_CLASS );
    }
    else {
        showError(INFORMATION_ID, message, ERROR_CLASS);
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        bindRegisterScripts();
    })
} else {
    bindRegisterScripts();
}
