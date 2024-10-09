const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.querySelector('.quote-display');
const quoteInputElement = document.querySelector('.quote-input');
const startButton = document.querySelector('.start-button');
const timerElement = document.querySelector('.time');
const wpmDisplay = document.querySelector('.wpm-display');

let startTime;
let timerInterval;

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const charSpan = document.createElement('span');
        charSpan.innerText = character;
        quoteDisplayElement.appendChild(charSpan);
    });
    quoteInputElement.value = '';
    wpmDisplay.innerHTML = '';
    startTimer();
}

quoteInputElement.addEventListener('input', () => {
    const quoteArray = quoteDisplayElement.querySelectorAll('span');
    const inputArray = quoteInputElement.value.split('');

    let correct = true;
    quoteArray.forEach((charSpan, index) => {
        const character = inputArray[index];
        if (character == null) {
            charSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (character === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            correct = false;
        }
    });

    if (correct && inputArray.length === quoteArray.length) {
        endGame();
    }
});

function startTimer() {
    timerElement.innerText = '0';
    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
    quoteInputElement.disabled = false;
    quoteInputElement.focus();
    startButton.disabled = true;
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function endGame() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    startButton.disabled = false;
    const timeTaken = getTimerTime();
    const wordCount = quoteDisplayElement.innerText.split(' ').length;
    const wpm = Math.round((wordCount / timeTaken) * 60);
    wpmDisplay.innerHTML = `<h4>Your typing speed is ${wpm} WPM</h4>`;
}

startButton.addEventListener('click', () => {
    renderNewQuote();
});