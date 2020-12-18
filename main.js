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

const dataObj = {
    players: [],
    colors: ['zielony', 'żółty', 'niebieski', 'czerwony'],
    bodyParts: ['lewa ręka', 'prawa ręka', 'lewa noga', 'prawa noga'],
    time: 5
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
    if (checkLength(input, 3) === false) {
        return;
    };

    if (input.key === 'Enter') {
        dataObj.time = parseInt(input.target.value);
        timer.textContent = dataObj.time;
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

const twisterSpin = () => {
    console.log(dataObj);
};