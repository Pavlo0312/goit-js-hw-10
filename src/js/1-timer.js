import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;

const startButton = document.querySelector('[data-start]');
/* Начальное состояние кнопки - неактивна */
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    const currentDate = new Date();

    if (userSelectedDate < currentDate) {
      iziToast.error({
        title: 'Error!',
        titleColor: '#ffffff',
        message: 'Please choose a date in the future',
        messageColor: '#ffffff',
        backgroundColor: '#ef4040',
        position: 'topRight',
      });
      /* Деактивация кнопки */
      startButton.disabled = true;
      startButton.classList.remove('start-btn-active');
    } else {
      /* Активация кнопки */
      startButton.disabled = false;
      startButton.classList.add('start-btn-active');
    }
  },
};

flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  /* Деактивация кнопки на старте */

  startButton.disabled = true;

  /* Деактивация input */

  startButton.classList.remove('start-btn-active');

  document.getElementById('datetime-picker').disabled = true;

  const timerId = setInterval(() => {
    const currentTime = Date.now();
    const timeLeft = userSelectedDate - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      /* Обновление таймера */
      updateTimerDisplay(0, 0, 0, 0);
      document.getElementById('datetime-picker').disabled = false;
      startButton.classList.remove('start-btn-active');
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
});

function updateTimerDisplay(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
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
