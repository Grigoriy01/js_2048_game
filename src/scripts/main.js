'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const startBtn = document.querySelector('.button');
const currentScore = document.querySelector('.game-score');
const tableItems = [...document.querySelectorAll('.field-cell')];
const messageItems = document.querySelector('.message-container');

// #region start Button
startBtn.addEventListener('click', () => {
  updateView();
});
// #endregion start Button

// --> updateView
function updateView() {
  const state = game.getState();

  renderBoard(state.board);
  renderStatusGame(state.statusGame);
  renderScore(state.score);
}

// --> rendering Board
const renderBoard = (dateBoard) => {
  const flatBoard = dateBoard.flat();

  tableItems.forEach((cell, i) => {
    const classListValue = [...cell.classList];
    const value = flatBoard[i];
    const classModif = `field-cell--${value}`;
    let j = 0;

    while (j < classListValue.length) {
      const currString = classListValue[j];

      if (currString.startsWith('field-cell--')) {
        cell.classList.remove(currString);
      }
      j++;
    }

    cell.textContent = value === 0 ? '' : value;
    cell.classList.add(classModif);
  });
};

// -->rendering Score
const renderScore = (dataScore) => {
  currentScore.textContent = dataScore;
};

// --> rendering Status - Game
function renderStatusGame(dataStatusGame) {
  updateButtonSate(dataStatusGame);
  getMessageByStatus(dataStatusGame);
}

// --> update the Button Start
const updateButtonSate = (statusValue) => {
  if (statusValue !== Game.statuses.idle) {
    game.restart();
  } else {
    game.start();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'restart';
  }
};

// --> a work with the Message
const messStart = messageItems.querySelector('.message-start');
const messWin = messageItems.querySelector('.message-win');
const messLose = messageItems.querySelector('.message-lose');

const getMessageByStatus = (statusValue) => {
  messStart.classList.add('hidden');
  messLose.classList.add('hidden');
  messWin.classList.add('hidden');
  messageItems.classList.add('hidden');

  if (statusValue !== Game.statuses.playing) {
    const sufix = statusValue === Game.statuses.win ? 'win' : 'lose';
    const messageEl = messageItems.querySelector(`.message-${sufix}`);

    messageEl.classList.remove('hidden');
    messageItems.classList.remove('hidden');
  }
};
