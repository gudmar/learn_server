(async function refreshIfNeeded() {
    const reply = await makeRequest({
        method: 'GET',
        route: getUrl('is-authorized')
    }).then((res) => {console.log(res); return res})
    .then((res) => getBodyAsJson(res))
    .then((body) => {console.log(body); return body});
    console.log('REfresh needed', reply)
    if (reply.isNotLoggedIn) { return; }
    if (reply.isRefreshNeeded) {
        await makeRequest({
            method: 'GET',
            route: getUrl('refresh-token')
        })
        window.location.reload();
    }
    throw new Error('Stop')
})()
