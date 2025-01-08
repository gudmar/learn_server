const actionsMap = [
    ['back', () => {
        console.log('back');
        history.back();
    }]
]

const setNavActions = () => {
    console.log('Setting ', actionsMap)
    for(action of actionsMap) {
        const allNodesWithActionName = document.querySelectorAll(`[data-action='${actionName}']`);
        allNodesWithActionName.forEach((node) => {
            node.addEventListener('click', actionFunction)
        })        
    }
}

window.onload = setNavActions;
