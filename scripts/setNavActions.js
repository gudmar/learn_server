const actionsMap = [
    ['back', () => {
        history.back();
    }],
    [
        'log out', async () => {
            console.log('Logging out')
            const url = getUrl('logout')
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            await doWithIncommingMessage(response)
            console.log(response)
        }
    ],
    [
        'login', async () => {
            window.location.assign(getUrl('login'))
        }
    ]
]

const setNavActions = () => {
    for(action of actionsMap) {
        const [actionName, actionFunction] = action
        const allNodesWithActionName = document.querySelectorAll(`[data-action='${actionName}']`);
        allNodesWithActionName.forEach((node) => {
            node.addEventListener('click', actionFunction)
        })        
    }
}

window.onload = setNavActions;
