window.addEventListener('DOMContentLoaded', () => {
    timeInput.addEventListener("input", onlyNumbers);
    usernameInput.addEventListener('keyup', addUser);
    timeInput.addEventListener('keyup', addTime);
    players.addEventListener('click', removeUser);
    controls.addEventListener('click', handleBtnClick);

});

const usernameInput = document.getElementById('username-input');
const timeInput = document.getElementById('time-input');
const usernameDisplay = document.getElementById('username-display');
const infoDisplay = document.getElementById('info-display');
const players = document.querySelector('.players-list');
const timer = document.getElementById('timer');
const errorMsg = document.getElementById('error-msg');
const timeStamp = document.querySelector('.time-stamp');
const units = document.getElementById('units');
const controls = document.querySelector('.controls');

const dataObj = {
    players: [],
    colors: ['zielony', 'żółty', 'niebieski', 'czerwony'],
    bodyParts: ['lewa ręka', 'prawa ręka', 'lewa noga', 'prawa noga'],
    time: 0
};

let $timerInterval;

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
        input.target.value < 5 ? units.textContent = ' sekundy' : units.textContent = ' sekund';
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

const handleBtnClick = button => {
    switch (button.target.id) {
        case 'start':
            handleStart(button);
            break;
        case 'stop':
            handleStop(button);
            break;
        case 'reset':
            handleReset(button);
            break;
    };
};

const handleStart = button => {
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

    controls.classList.add('active');

    const spinInterval = dataObj.time * 1000;

    let playerIndex = 0;

    if (infoDisplay.textContent === '') {
        const countDown = (secs) => {
            var timer = setInterval(() => {
                if (secs < 1) {
                    clearInterval(timer);
                    return infoDisplay.textContent = 'Start!';
                };
                infoDisplay.textContent = secs;
                secs--;
            }, 1000);
        };

        countDown(dataObj.time - 2);
    }

    $timerInterval = window.setInterval(() => {
        let randomNum1 = Math.floor((Math.random() * 4));
        let randomNum2 = Math.floor((Math.random() * 4));

        if (playerIndex >= dataObj.players.length) {
            playerIndex = 0;
        };

        usernameDisplay.textContent = dataObj.players[playerIndex++];
        infoDisplay.textContent = `${dataObj.bodyParts[randomNum1]} na ${dataObj.colors[randomNum2]}`;
    }, spinInterval);
};

const handleStop = () => {
    controls.classList.remove('active');
    clearInterval($timerInterval);
};

const handleReset = () => {
    dataObj.players = [];
    dataObj.time = 0;
    const playersList = players.querySelectorAll('li');
    const allParagraphs = document.getElementsByClassName('js-reset');

    for (let i = 0; i < allParagraphs.length; i++) {
        const paragraph = allParagraphs[i];

        paragraph.textContent = '';
    };

    playersList.forEach(player => {
        player.remove();
    });

    clearInterval($timerInterval);
};




// const handleSpeech = () => {
//     var synth = window.speechSynthesis;

//     var inputForm = document.querySelector('form');
//     var inputTxt = document.querySelector('.txt');
//     var voiceSelect = document.querySelector('select');

//     var pitch = document.querySelector('#pitch');
//     var pitchValue = document.querySelector('.pitch-value');
//     var rate = document.querySelector('#rate');
//     var rateValue = document.querySelector('.rate-value');

//     var voices = [];

//     function populateVoiceList() {
//         voices = synth.getVoices();

//         for (var i = 0; i < voices.length; i++) {
//             var option = document.createElement('option');
//             option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

//             if (voices[i].default) {
//                 option.textContent += ' -- DEFAULT';
//             }

//             option.setAttribute('data-lang', voices[i].lang);
//             option.setAttribute('data-name', voices[i].name);
//             voiceSelect.appendChild(option);
//         }
//     }

//     populateVoiceList();
//     if (speechSynthesis.onvoiceschanged !== undefined) {
//         speechSynthesis.onvoiceschanged = populateVoiceList;
//     }

//     inputForm.onsubmit = function (event) {
//         event.preventDefault();

//         var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
//         var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
//         for (var i = 0; i < voices.length; i++) {
//             if (voices[i].name === selectedOption) {
//                 utterThis.voice = voices[i];
//             };
//         };
//         utterThis.pitch = pitch.value;
//         utterThis.rate = rate.value;
//         synth.speak(utterThis);

//         inputTxt.blur();
//     };
// };