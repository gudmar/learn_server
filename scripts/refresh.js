(async function refreshIfNeeded() {
    console.log(window.location)
    const reply = await makeRequest({
        method: 'GET',
        route: getUrl('is-authorized')
    }).then((res) => {console.log(res); return res})
    .then((res) => getBodyAsJson(res))
    // .then((body) => {console.log(body); return body});
    console.log('REfresh needed', reply)
    if (reply.isNotLoggedIn) { return; }
    if (reply.isRefreshNeeded) {
        await makeRequest({
            method: 'HEAD',
            route: getUrl('refresh-token')
        })
        console.log('refresh-token request done, now proceed with next one')
        console.log(reply)
        // const { method, url } = JSON.parse(reply.originalRequest)
        // await makeRequest({
        //     method, route: url
        // })
        window.location.reload();
    }
    throw new Error('Stop')
})()
