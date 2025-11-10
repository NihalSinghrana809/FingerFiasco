const words = 'Adventure sparks excitement! But anxiety? It questions our every step... Balance; it keeps us steady, while beauty blossoms: a moment we capture. Challenge, with clarity, leads to collaboration comfortable, yet creative! In a culture of determination and discovery, emotions are dynamic; the environment? Essential! Experience teaches us to explore freedom, and friendship genuine brings harmony. Imagination inspires impact; influence, in turn, guides our journey! Laughter fuels leadership, and mindset? Motivation! Together, they open the door to opportunity. Passion? It fuels patience... and perspective, leading to powerful progress. Purposeful reflection? Absolutely! Resilience; respect; responsibility they, are all keys to strength and success. Talent, teamwork, and thoughtfulness: the path to transformation and understanding. Wisdom? Acceptance... and achievement. Bravery! Calmness? Change... clarity: compassion and connection. Courage drives curiosity; empathy and enthusiasm? They foster exploration. Gratitude; generosity growth! Happiness and honesty? Hope! Humility; kindness... and love. Mindfulness: optimism! Openness leads to perseverance... and positivity, potential! Purpose? Reflection... respect. Self-awareness, sincerity. Strength? Support! Teamwork... trust. Truth: understanding. Versatility! Vision? Vitality... and, ultimately, wisdom.'.split(' ');
let currentWords = words;
const wordsCount= words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart= null;
function addClass(el,name){
  el.className += ' '+name;
}
function removeClass(el,name){
  el.className = el.className.replace(name,'');
}
function randomWord(){
  const randomIndex= Math.ceil(Math.random()*wordsCount);
  return words[randomIndex - 1];
}
function formatWord(word){
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
function newGame(){
  document.getElementById('words').innerHTML='';
  for(let i=0;i<300;i++){
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector(".word"),'current');
  addClass(document.querySelector(".letter"),'current');
  document.getElementById('timer').innerHTML = (gameTime/1000) + '';
  window.timer = null;
}
const toggleButton = document.querySelector('.switch input[type="checkbox"]');
const body = document.body;
toggleButton.addEventListener('change', () => {
  if (toggleButton.checked) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
});
let currentMode = localStorage.getItem('mode');
if (currentMode === 'dark') {
  body.classList.add('dark-mode');
  toggleButton.checked = true;
} else {
  body.classList.remove('dark-mode');
  toggleButton.checked = false;
}
toggleButton.addEventListener('change', () => {
  if (toggleButton.checked) {
    body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
  } else {
    body.classList.remove('dark-mode');
    localStorage.setItem('mode', 'light');
  }
});
const timerDisplay = document.getElementById('timer');
const timerIntervals = document.querySelectorAll('.nav-link.active');
let selectedInterval = 0;
let timerRunning = false;
let startTime = 0;
let typedWords = 0;
timerIntervals.forEach((interval) => {
  interval.addEventListener('click', (e) => {
    selectedInterval = parseInt(e.target.getAttribute('date-time'));
    timerDisplay.innerText = `${selectedInterval / 1000}`; 
  });
});
document.addEventListener('keydown', (e) => {
  if (selectedInterval > 0 && !timerRunning) {
    countdown(selectedInterval);
    timerRunning = true;
    startTime = new Date().getTime();
  }
});
document.addEventListener('keydown', (e) => {
  if (selectedInterval > 0 && timerRunning) {
    typedWords++;
  }
});
function countdown(time) {
  let intervalId = setInterval(() => {
    time -= 1000; 
    timerDisplay.innerText = `${time / 1000}`; 
    if (time <= 0) {
      clearInterval(intervalId);
      gameOver(); 
    }
  }, 1000); 
}
function calculateWPM() {
  if (timerValue <= 0) {
    clearInterval(window.timer);
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000 / 60; 
    const wpm = (typedWords / elapsedTime) * 60;
    document.getElementById('timer').innerHTML = `WPM: ${wpm.toFixed(2)}`; 
  }
}
let timerValue = gameTime; 
document.querySelectorAll('.nav-link[data-time]').forEach(link => {
  link.addEventListener('click', (e) => {
    timerValue = parseInt(e.target.getAttribute('data-time'), 10);
    timerDisplay.innerHTML = `${timerValue / 1000}`; 
    newGame(); 
    startTimer(); 
  });
});
document.getElementById('timer').innerHTML = `${gameTime / 1000}`; 
function displayWords() {
  const wordsContainer = document.getElementById('words');
  wordsContainer.innerHTML = ''; 
  currentWords.forEach(word => {
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word + ' '; 
    wordsContainer.appendChild(wordSpan);
  });
}
displayWords();
function startGame() {
  window.timer = setInterval(() => {
    if (!window.gameStart) {
      window.gameStart = (new Date()).getTime();
    }
    const currentTime = (new Date()).getTime();
    const msPassed = currentTime - window.gameStart;
    const sPassed = Math.round(msPassed / 1000);
    const sLeft = (timerValue / 1000) - sPassed;
    if (sLeft <= 0) {
      gameOver();
      return;
    }
    document.getElementById('timer').innerHTML = sLeft + '';
  }, 1000);
}
function getWpm(){
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correntWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctletters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctletters.length === letters.length;
    });
    return correntWords.length / gameTime * 60000;
}
function gameOver() {
  clearInterval(window.timer); 
  addClass(document.getElementById('game'), 'over'); 
  const wpm = getWpm().toFixed(2); 
  document.getElementById('timer').innerHTML = `WPM: ${wpm}`; 
}
document.addEventListener('keydown', () => {
  const game = document.getElementById('game');
  if (document.activeElement !== game) {
    game.focus();
  }
});
document.getElementById('game').addEventListener('keydown', ev =>{
  const key= ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isExtra = document.querySelector(".letter.incorrect.extra");
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;
  const isFirstWord = !currentWord.previousSibling;
  if(document.querySelector('#game.over')){
    return;
  }
    if(!window.timer && isLetter){
        window.timer = setInterval(()=> {
            if(!window.gameStart){
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed/1000);
            const sLeft = (gameTime/1000) - sPassed;
            if(sLeft <= 0){
                gameOver();
                return;
            }
            document.getElementById('timer').innerHTML = sLeft + '';
        },1000);
    }
  if(isLetter){
    if(currentLetter){
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if(currentLetter.nextSibling){
        addClass(currentLetter.nextSibling, 'current');
      }
    } else{
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }
  if(isSpace){
    if(expected != ' '){
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter,'incorrect');
      });
    }
    removeClass(currentWord,'current');
    addClass(currentWord.nextSibling, 'current');
    if(currentLetter){
      removeClass(currentLetter,'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }
  if(isBackspace){
    if (isFirstWord && isFirstLetter) {
      return; 
    }
    if(isExtra){
      currentWord.removeChild(currentWord.lastChild);
    }
    else if(!currentWord.previousSibling && isFirstLetter){
      return;
    }
    else if(currentLetter && isFirstLetter){
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    else if(currentLetter && !isFirstLetter){
      removeClass(currentLetter,'current');
      addClass(currentLetter.previousSibling,'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    else if(!currentLetter){
      addClass(currentWord.lastChild,'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }
  if(currentWord.getBoundingClientRect().top > 230){
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 45) + 'px';
  }
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
})
document.getElementById('reset-button').addEventListener('click', () => {
    location.reload();
})
newGame();