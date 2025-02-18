const BACK_ACTION = 'back'
const LOG_OUT = 'log out'
const GO_TO_REGISTER = 'go to register'

const CLOCK = {
    label: 'clock',
    location: '/clock'
};

const STOP_WATCH = {
    label: 'stop-watch', location: '/stop-watch'
}

const LOGIN = { label: 'login', location: '/login'}

const getLogin = (isLoggedIn) => {
    console.log('Logout preparation')
    return {
        label: `${isLoggedIn ? 'Log out' : 'Log in'}`,
        action: LOG_OUT
    }
}

const IS_LOGGED_IN = {
    label: 'check if logged in',
    location: '/is-logged-in'
}

const HOME = { label: 'home', location: '/'}

const BACK = { label: 'back', action: BACK_ACTION }

module.exports = {
    home: HOME,
    clock: CLOCK,
    stopWatch: STOP_WATCH,
    login: LOGIN,
    getLogin,
    isLoggedIn: IS_LOGGED_IN,
    back: BACK
}
