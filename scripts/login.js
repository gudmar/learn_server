const bindRegisterButton = () => {
    const button = document.querySelector('.login-register');
    button.addEventListener('click', () => {
            console.log('Redirection to register')
            document.location.href = "/register";
        } 
    )
}

const bindLoginScripts = () => {
    console.log('Binding login scripts')
    bindRegisterButton()
    
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        bindLoginScripts();
    })
} else {
    bindLoginScripts();
}
