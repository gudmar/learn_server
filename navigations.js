const BACK_ACTION = 'back'

const CLOCK = {
    label: 'clock',
    location: '/clock'
};

const STOP_WATCH = {
    label: 'stop-watch', location: '/stop-watch'
}

const LOGIN = { label: 'login', location: '/login'}

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
    isLoggedIn: IS_LOGGED_IN,
    back: BACK
}
