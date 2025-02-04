const bindRegisterScripts = () => {
    const createAccountButton = document.querySelector('.register-create-account');
    createAccountButton.addEventListener('click', submitIfValid);
}

const fieldNameToIdMap = {
    nameField: 'register-name',
    nickNameField: 'register-nick-name',
    password1: 'register-password-1',
    password2: 'register-password-2',
}

const getFormFieldValues = () => {
    values = Object.entries(fieldNameToIdMap).reduce(
        (acc, [fieldName, id]) => {
            const element = document.getElementById(id);
            acc[fieldName] = element.value
            return acc
        }, {}
    )
    return values
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
    } = getFormFieldValues();
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

const getInformationField = () => document.getElementById('register-user-information')

const clearInformation = () => {
    const informationField = getInformationField();
    informationField.innerHTML = ''
    [
        ERROR_CLASS, SUCCESS_CLASS
    ].forEach((cssClass) => informationField?.classList?.remove(cssClass))
}

ERROR_CLASS = 'register-error'
SUCCESS_CLASS = 'register-success'

const showError = (message) => {
    const informationField = getInformationField();
    informationField.classList.add(ERROR_CLASS)
    informationField.innerHTML = message
}

const showSuccess = (message) => {
    const informationField = getInformationField();
    informationField.classList.add(SUCCESS_CLASS)
    informationField.innerHTML = message
}

const getForm = () => document.getElementById('register-user-form');

const getUrl = (endpoint) => `${window.location.origin}/${endpoint}`

const submit = async () => {
    const body = JSON.stringify(getFormFieldValues());
    // const body = getFormFieldValues()
    const url = getUrl('register')
    console.log(body)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Content-Type': 'application/json'
        },
        body
    })
    console.log(response)
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
        showSuccess('User probably registered');
    }
    else {
        showError(message);
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        bindRegisterScripts();
    })
} else {
    bindRegisterScripts();
}
