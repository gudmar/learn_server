const express = require('express');
const dotenv = require('dotenv');
const navs = require('./navigations.js')
const pug = require('pug');

dotenv.config({path: '.env'});
const PORT = process.env.PORT || 3000;

const server = express();
server.set('view engine', 'pug');
server.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})
server.get('/', (req, res) => {
    res.redirect('/home')
})

const getStylesPaths = (fileNames) => fileNames.map((fileName) => `./styles/${fileName}`);

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

server.get('/home', (req, res) => {
    const locals = {
        // styleFileNames: getStylesPaths([
        //     'navigation.css'
        // ]),
        tabTitle: 'Learning express',
        title: 'Home',
        navigationTitle: 'Options',
        styleFileNames: [
            './navigation.css',
            './pageWithNavigation.css'
        ],
        navigations: [
            navs.clock, navs.stopWatch,
            // navs.login, navs.isLoggedIn
        ]
    }
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
            navs.home, navs.clock
        ],
        styleFileNames: [
            'stopWatch.css',
            'navigation.css',
            'pageWithNavigation.css'
        ],
        scripts: ['stopWatch.js'],
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
            'pageWithNavigation.css'
        ],
        scripts: [
            'digitalClock.js',
            'setNavActions.js'
        ],
        navigations: [
            navs.home,
            navs.back,
            navs.stopWatch
        ],
        hours, minutes, secunds,
    };
    res.render('./pug/pages/digitalClockPage.pug', locals)
})

server.listen(process.env.LOCAL_PORT)
// server.listen(3000)
