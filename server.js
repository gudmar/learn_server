const express = require('express');
const dotenv = require('dotenv');
const navs = require('./navigations.js')
const bodyParser = require('body-parser')
const registerController = require('./Controlers/register')
const { handleLogin } = require('./Controlers/login')
const { markUserLoggedIn, IS_LOGGED_IN, LOGGED_OUT, REFRESH } = require('./Middleware/markUserLoggedIn');
const { validateRefreshJwt } = require('./Functions/validateJWT.js');
const { getRefreshTokenFromRequest } = require('./Functions/getFromRequest.js');
const { getJWTCookie, getAuthenticationTokenFromRefreshToken } = require('./Functions/getJWT.js');
const { logVerboose } = require('./getLoggingOptions.js');
const { refresh } = require('./Middleware/refresh.js');
const cookie = require('cookie')

dotenv.config({path: '.env'});
const PORT = process.env.PORT || 3000;

const server = express();
server.set('view engine', 'pug');

server.use(bodyParser.raw()) // This returns a parser that processes all possible body formats, matching them based on 'Content-Type'
// server.use(bodyParser.json()) // This returns a parser that returns a json encoded bodies and only such
// server.use(bodyParser.urlencoded({extended: false})) // THIS returns a parser that parses URL encoded bodies, and only such

server.use(async (req, res, next) => {
    console.log(req.method, req.path);
    next();
})

server.use(markUserLoggedIn) // ERROR when no cookies

server.use((req, res, next) => {
    console.log('isLoggedIn', req.isLoggedIn)
    return next();
})


server.use(bodyParser.json())
server.get('/', (req, res) => {
    res.redirect('/home')
})

server.post('/register', async (req, res) => {
   const {nameField, nickNameField, password1, password2} = req.body
   await registerController.register(req, res)
})

server.post('/login', async(req, res) => {
    await handleLogin(req, res)
})



server.get('/error', async(req, res) => {
    // res.render('<div class="error">Error</div>')
    console.log('Get error interior')
    return res.append('Content-Type', 'text/html').send('<div class="error">Error</div>')

})

server.use(express.static('styles'));
server.use(express.static('scripts'));

const commonNavigations = [
    {
        label: 'clock',
        location: '/clock',
    },
    {
        label: 'stop-watch', location: '/stop-watch'
    },
    {
        label: 'login',
        location: '/login'
    },
    {
        label: 'check if logged in',
        location: '/is-logged-in'
    }
]

server.get('/is-authorized', async(req, res) => {
    if (req.isLoggedIn === REFRESH) {
        res.send({isRefreshNeeded: true})
    }
    res.send({isRefreshNeeded: false})
})

server.get('/refresh-token', async (req, res) => {
    const refreshToken = getRefreshTokenFromRequest(req);
    logVerboose('Refresh token is', refreshToken, refreshToken);
    const isRefreshValid = await validateRefreshJwt(refreshToken);
    const body = req.body;
    // const originalRequest = body.originalRequest;
    // logVerboose('BODY', body)
    // if (!originalRequest) return res.redirect('/login')
    if (!isRefreshValid) {
        originalRequest.isLoggedIn = LOGGED_OUT;
        return res
        .cookie('jwt', '', {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            expires: Date.now(),
        })
        .cookie('refresh', '', {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            expires: Date.now(),
        })
        .send();
        // .redirect(originalRequest.url)
    }
    const validAuthenticatoinToken = await getAuthenticationTokenFromRefreshToken(refreshToken)
    return res
        .cookie('jwt', validAuthenticatoinToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
        })
        .cookie('Refreshed-already-done', JSON.stringify({done: true}))
        .send()
        // .redirect(originalRequest.url)

})

server.post('/logout', (req, res) => {
    const r = req;
    return res.status(200)
        .cookie('jwt', '', {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            expires: Date.now(),
        })
        .cookie('refresh', '', {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            expires: Date.now(),
        })
        .send({message: 'User logged out', command: 'reload'})
    console.log('Logging out')
})

server.get('/home',
            // refresh,
            (req, res) => {
    const locals = {
        // styleFileNames: getStylesPaths([
        //     'navigation.css'
        // ]),
        tabTitle: 'Learning express',
        title: 'Home',
        navigationTitle: 'Options',
        styleFileNames: [
            './navigation.css',
            './pageWithNavigation.css',
            './general.css'
        ],
        navigations: [
            navs.clock,
            navs.stopWatch,
            navs.login,
            navs.getLogin(req.isLoggedIn === IS_LOGGED_IN)
            // navs.login, navs.isLoggedIn
        ],
        scripts: [
            
            'scriptUtils.js',
            'refresh.js',
            'setNavActions.js'
        ],
        isLoggedIn: req.isLoggedIn === IS_LOGGED_IN,
        login: req.userLogin,
        name: req.userName,
    }
    logVerboose('In home route. Loggin status | login | name', req.isLoggedIn, req.userLogin, req.userName)
    res.render('./pug/pages/home.pug', locals)
})

// ========== OTHER WORKING SOLUTION =====================
// server.get('/home', (req, res) => {
//     res.setHeader('Content-Type', 'text/html')
//     const locals = {
//         styleFileNames: getStylesPaths([
//             'navigation.css'
//         ]),
//         navigations: [
//             {label: 'clock', location: '/clock'}
//         ]
//     }
//     const getHtmlContent = pug.compileFile('./views/pug/pages/home.pug')
//     const htmlContent = getHtmlContent(locals);
//     res.send(htmlContent)
// })

server.get('/stop-watch', (req, res) => {
    const locals = { 
        h: '0', m: '0', s: '0', ms: '0',
        tabTitle: 'Learning express',
        title: 'Home',
        navigationTitle: 'Options',
        navigations: [
            navs.home,
            navs.clock,
            navs.getLogin(req.isLoggedIn === IS_LOGGED_IN)
        ],
        styleFileNames: [
            'stopWatch.css',
            'navigation.css',
            'pageWithNavigation.css',
            './general.css',
            './scriptUtils'
        ],
        scripts: ['stopWatch.js'],
        isLoggedIn: req.isLoggedIn === IS_LOGGED_IN,
        login: req.userLogin,
        name: req.userName,
    };
    res.render('./pug/pages/stoperPage.pug', locals)
})

server.get('/clock', (req, res) => {
    const date = new Date(Date.now());
    const hours = `${date.getHours()}`.padStart(2, 0);
    const minutes = `${date.getMinutes()}`.padStart(2, 0);
    const secunds = `${date.getSeconds()}`.padStart(30, 1);
    const locals = {
        styleFileNames: [
            'navigation.css',
            'digitalClock.css',
            'pageWithNavigation.css',
            './general.css'
        ],
        scripts: [
            'digitalClock.js',
            'setNavActions.js',
            './scriptUtils.js'
        ],
        navigations: [
            navs.home,
            navs.back,
            navs.stopWatch,
            navs.getLogin(req.isLoggedIn === IS_LOGGED_IN)
        ],
        hours, minutes, secunds,
        isLoggedIn: req.isLoggedIn,
        login: req.userLogin,
        name: req.userName,
    };
    res.render('./pug/pages/digitalClockPage.pug', locals)
})

server.get('/is-logged-in', (req, res) => {
    res.send({isLogged: req.isLoggedIn === IS_LOGGED_IN})
})

const refreshTokenThenAskAgain = (req, res) => {
    const requestEssentials = {
        method: req.method,
        params: req.params,
        url: req.originalUrl,
        body: req.body,
        headers: req.headers,
    }
    
}

server.get('/login', (req, res) => {
    const locals = {
        styleFileNames: [
            'navigation.css',
            'login.css',
            'pageWithNavigation.css',
            'forms.css',
            './general.css'
        ],
        scripts: [
            'scriptUtils.js',
            'setNavActions.js',
            'login.js',
        ],
        navigations: [
            navs.home,
            navs.back,
            // navs.login,
            navs.getLogin(req.isLoggedIn === IS_LOGGED_IN),
            navs.clock,
            navs.stopWatch,
            navs.isLoggedIn
        ],
        isLoggedIn: req.isLoggedIn === IS_LOGGED_IN,
        login: req.userLogin,
        name: req.userName,
    };
    res.render('./pug/pages/loginPage.pug', locals)
})

server.get('/register', (req, res) => {
    const locals = {
        styleFileNames: [
            'navigation.css',
            'register.css',
            'pageWithNavigation.css',
            'forms.css',
            './general.css'
        ],
        scripts: [
            'scriptUtils.js',
            'register.js',
            'setNavActions.js'
        ],
        navigations: [
            navs.home,
            navs.back,
            // navs.login,
            navs.getLogin(req.isLoggedIn === IS_LOGGED_IN),
            navs.isLoggedIn,
            navs.clock,
            navs.stopWatch,
        ],
        isLoggedIn: req.isLoggedIn === IS_LOGGED_IN,
        login: req.userLogin,
        name: req.userName,
    };
    res.render('./pug/pages/registerPage.pug', locals)
})


server.listen(process.env.LOCAL_PORT)
// server.listen(3000)
