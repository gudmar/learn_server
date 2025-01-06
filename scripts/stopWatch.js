const updateContentIfChanged = (container, newContent, message) => {
    const isChange = container.innerText !== newContent;
    if (isChange) {
        container.innerText = newContent;
    }
}

const getSeconds = (ms) => Math.floor(ms / 1000) % 60;
const getMinutes = (ms) => (Math.floor(ms / (1000 * 60)) % 60);
const getHours = (ms) => Math.floor(ms / (1000 * 60 * 60 ));
const getMiliSeconds = (ms) => ms % 1000;

class StopWatch {
    constructor(updateOnUiCallback) {
        this.time = 0;
        this._isNotStarted = true;
        this._isPaused = false;
        this.updateOnUiCallback = updateOnUiCallback
        this.startTimer()
    }
    reset() {
        this.time = 0;
        this.timestamp = undefined;
        this.updateTime();
        this.updateOnUiCallback(this.time);
    }
    updateTime() {
        if (this.timestamp === undefined) this.timestamp = Date.now();
        this.nextTimestamp = Date.now();
        this.timestampDelta = this.nextTimestamp - this.timestamp;
        this.timestamp = this.nextTimestamp;
        this.time += this.timestampDelta;
    }
    get isNotStarted() {
        return this._isNotStarted
    }
    get isPaused() {
        return this._isPaused;
    }
    start() {
        this._isNotStarted = false;
    }
    resume() {
        this.timestamp = Date.now();
        this._isPaused = false;
    }
    pause() {
        this._isPaused = true;
    }
    startTimer() {
        this.updateInterval = setInterval(
            (() => {
                if (this.isNotStarted || this.isPaused) return;
                this.updateTime();
                this.updateOnUiCallback(this.time);
            }).bind(this), 1
        )
    }
}

const updateStopWatch = (time) => {
    const hoursSegment = document.querySelector('.stoper-hours');
    const minutesSegment = document.getElementsByClassName('stoper-minutes')[0]
    const secundesSegment = document.getElementsByClassName('stoper-seconds')[0]
    const miliSecundesSegment = document.getElementsByClassName('stoper-miliseconds')[0]

    const newHours = getHours(time);
    const newMinutes = getMinutes(time);
    const newSeconds = getSeconds(time);
    const newMiliSeconds = getMiliSeconds(time)
    updateContentIfChanged(hoursSegment, `${newHours}`.padStart(2, 0));
    updateContentIfChanged(minutesSegment, `${newMinutes}`.padStart(2, '0'));
    updateContentIfChanged(secundesSegment, `${newSeconds}`.padStart(2, '0'), 'secundes updated');
    updateContentIfChanged(miliSecundesSegment, `${newMiliSeconds}`.padStart(3, '0'));
}

class TwoStateButtonStateHandler {
    get oddClickStateLabel() {
        return 'Odd dummy'
    }

    get evenClickStateLabel() {
        return 'Even dummy'
    }

    get oddClickClassList() {
        return []
    }

    get evenClickClassList() {
        return []
    }

    removeClasses(list) {
        list.forEach(((className) => {
            this.button.classList.remove(className)
        }).bind(this))
    }

    addClasses(list) {
        list.forEach(((className) => {
            this.button.classList.add(className)
        }).bind(this))
    }

    onOddClick() {
        this.button.innerText = this.oddClickStateLabel;
        this.removeClasses(this.evenClickClassList);
        this.addClasses(this.oddClickClassList)
        this.onOddClickAction()
    }

    onEvenClick() {
        this.button.innerText = this.evenClickStateLabel;
        this.removeClasses(this.oddClickClassList);
        this.addClasses(this.evenClickClassList)
        this.onEvenClickAction();
    }

    onOddClickAction() {throw new Error('Implement odd click')}

    onEvenClickAction() {throw new Error('Implement even click')}

    constructor(){
        this.nrClicks  = 0;
    }
    onClick(){
        this.nrClicks++;
        if (this.nrClicks % 2 === 0) this.onEvenClick()
        else this.onOddClick();
        
    }
}

class StartWatchButtonStateHandler extends TwoStateButtonStateHandler {
    get oddClickStateLabel() {
        return 'Started'
    }

    get evenClickStateLabel() {
        return 'Started'
    }

    get oddClickClassList() {
        return ['stop-watch-button-disabled']
    }

    constructor({
        button, onOddClickAction, onEvenClickAction
    }) {
        super()
        this.button = button;
        this.onOddClickAction = onOddClickAction
        this.onEvenClickAction = onEvenClickAction
        this.button.addEventListener('click', this.onClick.bind(this))
    }
}

class PauseStopwatchButtonStateHandler extends TwoStateButtonStateHandler {
    get oddClickStateLabel() {
        return 'Resume'
    }
    get evenClickStateLabel() {
        return 'Pause'
    }
    constructor({
        button, onOddClickAction, onEvenClickAction
    }) {
        super();
        this.button = button;
        this.onOddClickAction = onOddClickAction;
        this.onEvenClickAction = onEvenClickAction;
        this.button.addEventListener('click', this.onClick.bind(this))
    }
}

const initializeKeyboard = (stopWatch) => {
    const startButton = document.querySelector('.stoper-start');
    const pauseButton = document.querySelector('.stoper-pause');
    const resetButton = document.querySelector('.stoper-reset');
    const startButtonStateHandler = new StartWatchButtonStateHandler({
        button: startButton,
        onEvenClickAction: () => {},
        onOddClickAction: stopWatch.start.bind(stopWatch)
    })
    const pauseButtonStateHandler = new PauseStopwatchButtonStateHandler({
        button: pauseButton,
        onEvenClickAction: stopWatch.resume.bind(stopWatch),
        onOddClickAction: stopWatch.pause.bind(stopWatch)
    })
    resetButton.addEventListener('click', stopWatch.reset.bind(stopWatch));
}

const timer = new StopWatch(updateStopWatch);


window.onload = () => {
    initializeKeyboard(timer);
}
