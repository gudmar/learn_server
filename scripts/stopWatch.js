const updateContentIfChanged = (container, newContent, message) => {
    const isChange = container.innerText !== newContent;
    if (isChange) {
        container.innerText = newContent;
        if (message) console.log(message)
    }
}

const getSeconds = (ms) => Math.floor(ms / 1000) % 60;
const getMinutes = (ms) => (Math.floor(ms / (1000 * 60)) % 60);
const getHours = (ms) => Math.floor(ms / (1000 * 60 * 60 ));
const getMiliSeconds = (ms) => ms % 1000;

class StopWatch {
    constructor(updateOnUiCallback) {
        this.time = 0;
        // this.isNotStarted = true;
        this.isNotStarted = false;
        this.isPaused = false;
        this.startTimer(updateOnUiCallback)
    }
    updateTime() {
        if (this.timestamp === undefined) this.timestamp = Date.now();
        this.nextTimestamp = Date.now();
        this.timestampDelta = this.nextTimestamp - this.timestamp;
        this.timestamp = this.nextTimestamp;
        this.time += this.timestampDelta;
    }
    start() {
        this.isNotStarted = false;
    }
    resume() {
        this.timestamp = Date.now();
        this.isPaused = false;
    }
    pause() {
        this.isPaused = true;
    }
    startTimer(updateOnUiCallback) {
        this.updateInterval = setInterval(
            () => {
                if (this.isNotStarted || this.isPaused) return;
                this.updateTime();
                updateOnUiCallback(this.time);
            }, 1
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

    // let time = 0;
    // const updateTime = setInterval( () => time++, 10)
    // const interval = setInterval(
    //     () => {
    //         const newHours = getHours(time);
    //         const newMinutes = getMinutes(time);
    //         const newSeconds = getSeconds(time);
    //         const newMiliSeconds = getMiliSeconds(time)
    //         updateContentIfChanged(hoursSegment, `${newHours}`.padStart(2, 0));
    //         updateContentIfChanged(minutesSegment, `${newMinutes}`.padStart(2, '0'));
    //         updateContentIfChanged(secundesSegment, `${newSeconds}`.padStart(2, '0'));
    //         updateContentIfChanged(miliSecundesSegment, `${newMiliSeconds}`.padEnd(3, '0'));
    //     }, 10
    // )
}

const timer = new StopWatch(updateStopWatch);

window.onload = updateStopWatch;
