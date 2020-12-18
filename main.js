window.addEventListener('DOMContentLoaded', () => {
    timeInput.addEventListener("input", onlyNumbers);
    usernameInput.addEventListener('keyup', addUser);
    timeInput.addEventListener('keyup', addTime);
    players.addEventListener('click', removeUser);
    spinBtn.addEventListener('click', twisterSpin);
});

const usernameInput = document.getElementById('username-input');
const timeInput = document.getElementById('time-input');
const usernameDisplay = document.getElementById('username-display');
const infoDisplay = document.getElementById('info-display');
const spinBtn = document.getElementById('spin');
const players = document.querySelector('.players');
const timer = document.getElementById('timer');
const errorMsg = document.getElementById('error-msg');
const timeStamp = document.querySelector('.time-stamp');

const dataObj = {
    players: [],
    colors: ['zielony', 'żółty', 'niebieski', 'czerwony'],
    bodyParts: ['lewa ręka', 'prawa ręka', 'lewa noga', 'prawa noga'],
    time: 0
};

const onlyNumbers = input => {
    input.target.value = input.target.value.replace(/[E\+\-]/gi, "");
};

const checkLength = (input, max) => {
    if (input.target.value.length >= max || input.target.value === '') {
        input.target.classList.add('error');
        return false;
    } else {
        input.target.classList.remove('error');
    };
};

const addTime = input => {
    const minTime = 1;

    if (input.target.value < minTime || input.target.value >= 100) {
        input.target.classList.add('error');
        errorMsg.textContent = 'Niedozwolona wartość';
        if (input.target.value < minTime) {
            errorMsg.textContent = `Minimalna wartość to ${minTime}s`;
        }
        return;
    };

    input.target.classList.remove('error');
    errorMsg.textContent = '';

    if (input.key === 'Enter') {
        dataObj.time = parseInt(input.target.value);
        timer.textContent = dataObj.time;
        input.target.value = '';
        errorMsg.textContent = '';
        timeStamp.classList.add('active');
    };
};

const displayPlayer = () => {
    const player = document.createElement('li');
    player.className = 'player';

    dataObj.players.forEach((element, index) => {
        player.textContent = element;
        player.id = 'player' + (index + 1);
        players.appendChild(player);
    });
};

const addUser = input => {
    errorMsg.textContent = '';

    if (dataObj.players.length >= 4) {
        errorMsg.textContent = 'Za dużo graczy!';
        return input.target.classList.add('error');
    } else if (checkLength(input, 12) === false) {
        errorMsg.textContent = 'Za długi nick!';
        return;
    };

    if (input.key === 'Enter') {
        const playersArr = dataObj.players;
        playersArr.push(input.target.value);
        input.target.value = '';

        displayPlayer();
    };
};

const removeUser = user => {
    dataObj.players.filter(player => {
        if (player === user.target.textContent) {
            const index = dataObj.players.indexOf(user.target.textContent);
            if (index > -1) {
                dataObj.players.splice(index, 1);
            };

            user.target.remove();
            usernameInput.classList.remove('error');
            return dataObj.players;
        };
    });
    errorMsg.textContent = '';
};

const twisterSpin = button => {
    if (dataObj.players.length === 0) {
        errorMsg.textContent = 'Dodaj graczy!';
        return;
    } else if (dataObj.time === 0) {
        errorMsg.textContent = 'Dodaj czas!';
        return;
    };

    if (button.target.classList.contains('active')) {
        return;
    };

    button.target.classList.add('active');

    const spinInterval = dataObj.time * 1000;

    let playerIndex = 0;

    setInterval(() => {
        let randomNum1 = Math.floor((Math.random() * 4));
        let randomNum2 = Math.floor((Math.random() * 4));

        if (playerIndex >= dataObj.players.length) {
            playerIndex = 0;
        };

        usernameDisplay.textContent = dataObj.players[playerIndex++];
        infoDisplay.textContent = `${dataObj.bodyParts[randomNum1]} na ${dataObj.colors[randomNum2]}`;
    }, spinInterval);
};