'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

class GameView {
  #timerWin;

  constructor(logic) {
    this.game = logic;

    this.startBtn = document.querySelector('.button');
    this.currentScore = document.querySelector('.game-score');
    this.tableItems = [...document.querySelectorAll('.field-cell')];
    this.messageItems = document.querySelector('.message-container');
    this.titleGame = document.querySelector('h1');

    // --> var for the blocks Message
    this.messStart = this.messageItems.querySelector('.message-start');
    this.messWin = this.messageItems.querySelector('.message-win');
    this.messLose = this.messageItems.querySelector('.message-lose');

    this.initListener();

    this.timerIdle = setTimeout(
      () => this.applyAnimationClass(this.startBtn),
      5000,
    );
  }

  // #region Listeners
  initListener() {
    this.startBtn.addEventListener('click', () => {
      this.handleBtnStart();
      clearTimeout(this.timerIdle);
      this.updateView();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.game.moveLeft();
        this.updateView();
      }

      if (e.key === 'ArrowRight') {
        this.game.moveRight();
        this.updateView();
      }

      if (e.key === 'ArrowUp') {
        this.game.moveUp();
        this.updateView();
      }

      if (e.key === 'ArrowDown') {
        this.game.moveDown();
        this.updateView();
      }
    });

    // #endregion Listeners
  }

  // --> updateView
  updateView() {
    const state = this.game.getState();

    this.renderBoard(state.board);
    this.renderStatusGame(state.statusGame);
    this.renderScore(state.score);
  }
  // #region methods-tools
  // timer win
  runWinTimer() {
    this.#timerWin = setTimeout(
      () => this.applyAnimationClass(this.startBtn),
      5000,
    );
  }
  // --> work with message blocks
  renderMessage(statusValue) {
    if (statusValue === Game.statuses.idle) {
      return;
    }

    this.messStart.classList.add('hidden');
    this.messLose.classList.add('hidden');
    this.messWin.classList.add('hidden');
    this.messageItems.classList.add('hidden');
    this.titleGame.classList.remove('hidden');

    if (statusValue !== Game.statuses.playing) {
      const sufix = statusValue === Game.statuses.win ? 'win' : 'lose';
      const messageEl = this.messageItems.querySelector(`.message-${sufix}`);

      if (sufix === 'lose') {
        this.runWinTimer();
      }

      if (sufix === 'win') {
        this.titleGame.classList.add('hidden');
      }
      messageEl.classList.remove('hidden');
      this.messageItems.classList.remove('hidden');
    }
  }

  // --> handleBtnStart
  handleBtnStart() {
    const statusValue = this.game.getState().statusGame;

    if (statusValue !== Game.statuses.idle) {
      this.game.restart();
      this.tableItems.forEach((el) => this.applyAnimationClass(el));
      this.applyAnimationClass(this.startBtn);
      clearTimeout(this.#timerWin);
    } else {
      this.game.start();
      this.applyAnimationClass(this.startBtn);
      clearTimeout(this.timerIdle);
    }
  }

  // --> rendering Board
  renderBoard = (dateBoard) => {
    const flatBoard = dateBoard.flat();

    this.tableItems.forEach((cell, i) => {
      const classListValue = [...cell.classList];
      const value = flatBoard[i];
      const classModif = `field-cell--${value}`;
      let j = 0;

      // change the class-modificator
      while (j < classListValue.length) {
        const currString = classListValue[j];

        if (currString.startsWith('field-cell--')) {
          cell.classList.remove(currString);
        }
        j++;
      }

      if (value === 2048) {
        this.applyAnimationClass(cell);
        this.runWinTimer();
      }

      cell.textContent = value === 0 ? '' : value;
      cell.classList.add(classModif);
    });
  };

  // --> rendering Status - Game
  renderStatusGame(infoStatus) {
    // changing button
    if (infoStatus !== Game.statuses.idle) {
      this.startBtn.classList.remove('start');
      this.startBtn.classList.add('restart');
      this.startBtn.textContent = 'restart';
    }

    this.renderMessage(infoStatus);
  }

  // -->rendering Score
  renderScore = (dataScore) => {
    this.currentScore.textContent = dataScore;
  };
  // #endregion methods-tools

  // #region animation
  applyAnimationClass(element) {
    const currStatus = this.game.getState().statusGame;

    if (currStatus === Game.statuses.playing) {
      element.classList.remove('vibrate-element');

      return;
    }

    element.classList.add('vibrate-element');
  }
}

const view = new GameView(game);

view.updateView();
