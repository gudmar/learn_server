const bindRegisterButton = () => {
    const button = document.querySelector('.register-create-account');
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

window.onload = () => {
    bindLoginScripts();
}
