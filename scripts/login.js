const bindRegisterButton = () => {
    const button = document.querySelector('.login-register');
    button.addEventListener('click', () => {
            console.log('Redirection to register')
            document.location.href = "/register";
        } 
    )
}

const bindLoginButton = () => {
    const button = document.querySelector('.login-login');
    button.addEventListener('click', () => {
        console.log('Login user')
        submit()
    })
}

const INFORMATION_ID = 'login-user-information';

const fieldNameToIdMap = {
    login: 'login-nick-name',
    password: 'login-password'
}

const submit = async () => {
    const body = JSON.stringify(getFormFieldValues(fieldNameToIdMap))
    const url = getUrl('login')
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    })
    const responseBody = await getBodyAsJson(response)
    showError(INFORMATION_ID, responseBody.message, '')
}

const bindLoginScripts = () => {
    console.log('Binding login scripts')
    bindRegisterButton();
    bindLoginButton();

    setDefaultValues({
        login: 'doe-0',
        password: 'doe00'    
    })
    
}

const login = async () => {
    const loginButton = document.querySelector('./login-login')
    loginButton.addEventListener('click', () => {

    })
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        bindLoginScripts();
    })
} else {
    bindLoginScripts();
}
