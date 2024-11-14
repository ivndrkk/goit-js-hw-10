import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
const datePicker = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let countdownInterval;
let userSelectedDate;


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
    handleDateSelection(selectedDates[0]);
    },
};
flatpickr(datePicker, options);

function handleDateSelection(selectedDate) {
    if (selectedDate <= new Date()) {
        iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
    } else {
        startButton.disabled = false;
        userSelectedDate = selectedDate;
    }
}

startButton.addEventListener('click', startCountdown);

function startCountdown() {
    startButton.disabled = true;
    datePicker.disabled = true;

    countdownInterval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = userSelectedDate - currentTime;

        if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        updateTimerDisplay(0, 0, 0, 0);
        datePicker.disabled = false;
        return;
        }

        const timeValues = convertMs(timeLeft);
        updateTimerDisplay(
            timeValues.days,
            timeValues.hours,
            timeValues.minutes,
            timeValues.seconds
        );
    }, 1000);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
