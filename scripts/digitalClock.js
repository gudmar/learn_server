const updateContentIfChanged = (container, newContent) => {
    const isChange = container.innerText !== newContent;
    if (isChange) container.innerText = newContent;
}

const updateClock = () => {
    const hoursSegment = document.querySelector('.digital-clock-hours');
    const minutesSegment = document.getElementsByClassName('digital-clock-minutes')[0]
    const secundesSegment = document.getElementsByClassName('digital-clock-secundes')[0]
    const interval = setInterval(
        () => {
            const date = new Date(Date.now())
            const newHours = date.getHours();
            const newMinutes = date.getMinutes();
            const newSeconds = date.getSeconds();
            updateContentIfChanged(hoursSegment, `${newHours}`.padStart(2, 0));
            updateContentIfChanged(minutesSegment, `${newMinutes}`.padStart(2, '0'));
            updateContentIfChanged(secundesSegment, `${newSeconds}`.padStart(2, '0'));
        }, 1000
    )
}

window.onload = updateClock;
