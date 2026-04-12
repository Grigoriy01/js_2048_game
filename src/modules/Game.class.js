'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  static statuses = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  #score = 0;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.board = structuredClone(initialState); // tiefe clonen
    this.status = Game.statuses.playing;
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.#score = 0;
    this.generateRandomPositions();
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
  // --> random position of Numbers on the board
  generateRandomPositions() {
    const cellPosition = {
      x: [],
      y: [],
    };

    this.board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === 0) {
          cellPosition.y.push(colIndex);
          cellPosition.x.push(rowIndex);
        }
      });
    });

    const randomIndex = Math.floor(Math.random() * cellPosition.x.length);
    const coorX = cellPosition.x[randomIndex];
    const coorY = cellPosition.y[randomIndex];

    this.board[coorX][coorY] = this.getRandomNumbers();
  }

  // --> randoms numbers 2 or (4 - 10% chance)
  getRandomNumbers() {
    if (this.status === Game.statuses.idle) {
      this.status = Game.statuses.playing;

      return 2;
    } else {
      return Math.random() > 0.1 ? 4 : 2;
    }
  }
}

const game = new Game();

game.start();

module.exports = Game;
