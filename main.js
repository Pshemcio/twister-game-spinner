window.addEventListener('DOMContentLoaded', () => {
    timeInput.addEventListener("input", onlyNumbers);
    usernameInput.addEventListener('keyup', addUser);
    timeInput.addEventListener('keyup', addTime);
    document.body.addEventListener('click', handleClick);
    // speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
    // document.addEventListener('click', test);
    soundAgreementBtn.addEventListener('click', userSoundAgreement);
});

const usernameInput = document.getElementById('username-input');
const timeInput = document.getElementById('time-input');
const usernameDisplay = document.getElementById('username-display');
const infoDisplay = document.getElementById('info-display');
const players = document.getElementById('players-list');
const timer = document.getElementById('timer');
const errorMsg = document.getElementById('error-msg');
const timeStamp = document.querySelector('.time-stamp');
const units = document.getElementById('units');
const controls = document.getElementById('controls');
const voiceSelect = document.getElementById('voice-select');
const langBtn = document.getElementById('lang-btn');
const hiddenMenu = document.getElementsByClassName('hidden');
const info = document.getElementById('info');
const soundAgreementBtn = document.getElementById('sound-agreement');

let dataObj = {
    players: [],
    colors: ['zielony', 'żółty', 'niebieski', 'czerwony'],
    bodyParts: ['lewa ręka', 'prawa ręka', 'lewa noga', 'prawa noga'],
    time: 0
};

let $voices = [];
let $timerInterval;
let hasEnabledVoice = false;

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
    const minTime = 4;

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
        handleSpeech(usernameDisplay.textContent, infoDisplay.textContent);
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

// showing hidden menu and hiding button
const showHiddenMenu = button => {
    button.target.closest('.js-menu').querySelector('.hidden').classList.add('active');
    button.target.classList.remove('active');
    setTimeout(() => {
        button.target.style.display = 'none';
    }, 400);
};

function populateVoiceList() {
    if ($voices.length > 0) {
        return;
    };

    $voices = speechSynthesis.getVoices();

    $voices.forEach(voice => {
        if (langBtn.getAttribute('data-name') === null) {
            langBtn.setAttribute('data-name', $voices[0].name);
            langBtn.classList.add('active');
        };

        let option = document.createElement('li');
        let text = `${voice.name.slice(7)}  (${voice.lang})`;

        option.textContent = text;

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

const selectVoice = item => {
    langBtn.setAttribute('data-name', item.target.getAttribute('data-name'));
    voiceSelect.classList.remove('active');
    langBtn.style.display = 'block';
    langBtn.classList.add('active');
    langBtn.innerText = item.target.getAttribute('data-lang').slice(3,)
};

const handleSpeech = (name, order) => {
    let utterThis = new SpeechSynthesisUtterance();
    utterThis.text = `${name}, ${order}`;
    let selectedOption = langBtn.getAttribute('data-name');

    for (let i = 0; i < $voices.length; i++) {
        if ($voices[i].name === selectedOption) {
            utterThis.voice = $voices[i];
        };
    };
    speechSynthesis.speak(utterThis);
};

const hideMenu = menu => {
    const btn = menu.parentElement.querySelector('.outer-btn');
    btn.style.display = 'block';
    menu.classList.remove('active');
    setTimeout(() => {
        btn.classList.add('active');
    }, 100);
};

const closeAfterClickOutside = (clickTarget) => {
    for (let i = 0; i < hiddenMenu.length; i++) {
        const menu = hiddenMenu[i];
        if (menu.classList.contains('active')) {
            if (clickTarget.target.closest('section') === null) {
                hideMenu(menu);
            };
        };
    };
};

const handleClick = clickTarget => {
    switch (clickTarget.target.parentElement) {
        case players:
            removeUser(clickTarget);
            break;
        case controls:
            handleBtnClick(clickTarget);
            break;
        case voiceSelect:
            selectVoice(clickTarget);
            break;
        default:
            if (clickTarget.target === info) {
                hideMenu(info);
            } else if (clickTarget.target === voiceSelect) {
                hideMenu(voiceSelect);
            } else if (clickTarget.target.nodeName == "BUTTON" && clickTarget.target.parentElement.className === 'js-menu') {
                showHiddenMenu(clickTarget);
            } else {
                closeAfterClickOutside(clickTarget);
            };
            break;
    };
};

const userSoundAgreement = btn => {
    if (hasEnabledVoice) {
        return;
    };

    let lecture = new SpeechSynthesisUtterance();
    lecture.volume = 1;
    lecture.text = 'Dzięki, możemy grać!'
    speechSynthesis.speak(lecture);
    hasEnabledVoice = true;
    console.log('dziala')
    speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
    btn.target.classList.remove('avtive');
    btn.target.style.display = 'none';
};