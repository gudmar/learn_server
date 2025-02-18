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
            console.log(response)
        }
    ]
]

const setNavActions = () => {
    // console.log('Setting ', actionsMap)
    console.log(actionsMap)
    for(action of actionsMap) {
        const [actionName, actionFunction] = action
        const allNodesWithActionName = document.querySelectorAll(`[data-action='${actionName}']`);
        console.log(allNodesWithActionName)
        allNodesWithActionName.forEach((node) => {
            node.addEventListener('click', actionFunction)
        })        
    }
}

window.onload = setNavActions;
