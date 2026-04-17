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

  #size;

  #score = 0;
  #initialBoard;
  #status;

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
    this.#initialBoard = structuredClone(initialState);
    this.board = structuredClone(this.#initialBoard); // tiefe clonen
    this.#size = this.board.length;
    this.#status = Game.statuses.idle;
  }
  // #region moves
  moveLeft() {
    if (
      this.#status === Game.statuses.lose ||
      this.#status === Game.statuses.win
    ) {
      return;
    }

    let canMove = false;

    this.board = this.board.map((row) => {
      const { newValidArray, isChanged } = this.#shiftDirection(row);

      canMove ||= isChanged;

      return newValidArray;
    });

    if (!canMove) {
      return;
    }

    this.#generateRandomPositions();
    this.#checkGameStatus();
  }

  moveRight() {
    if (
      this.#status === Game.statuses.lose ||
      this.#status === Game.statuses.win
    ) {
      return;
    }

    let canMove = false;

    this.board = this.board.map((row) => {
      const { newValidArray, isChanged } = this.#shiftDirection(
        [...row].reverse(),
      );

      canMove ||= isChanged;

      return newValidArray.reverse();
    });

    if (!canMove) {
      return;
    }

    this.#generateRandomPositions();
    this.#checkGameStatus();
  }

  moveUp() {
    if (
      this.#status === Game.statuses.lose ||
      this.#status === Game.statuses.win
    ) {
      return;
    }

    let canMove = false;

    for (let x = 0; x < this.#size; x++) {
      const emptyRow = [];

      for (let y = 0; y < this.#size; y++) {
        emptyRow.push(this.board[y][x]);
      }

      const { newValidArray, isChanged } = this.#shiftDirection(emptyRow);
      const cleanedEmptyRow = newValidArray;

      canMove ||= isChanged;

      for (let y = 0; y < this.#size; y++) {
        this.board[y][x] = cleanedEmptyRow[y];
      }
    }

    if (!canMove) {
      return;
    }

    this.#generateRandomPositions();
    this.#checkGameStatus();
  }

  moveDown() {
    if (
      this.#status === Game.statuses.lose ||
      this.#status === Game.statuses.win
    ) {
      return;
    }

    let canMove = false;

    for (let x = 0; x < this.#size; x++) {
      const emptyRow = [];

      for (let y = 0; y < this.#size; y++) {
        emptyRow.push(this.board[y][x]);
      }

      const { newValidArray, isChanged } = this.#shiftDirection(
        [...emptyRow].reverse(),
      );
      const cleanedEmptyRow = newValidArray.reverse();

      canMove ||= isChanged;

      for (let y = 0; y < this.#size; y++) {
        this.board[y][x] = cleanedEmptyRow[y];
      }
    }

    if (!canMove) {
      return;
    }

    this.#generateRandomPositions();
    this.#checkGameStatus();
  }
  // #endregion moves

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return {
      score: this.#score,
      statusGame: this.#status,
      board: this.board,
    };
  }

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
  getStatus() {
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#score = 0;
    this.#generateRandomPositions();
    this.#generateRandomPositions();
    this.#status = Game.statuses.playing;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#score = 0;
    this.board = structuredClone(this.#initialBoard);
    this.#generateRandomPositions();
    this.#generateRandomPositions();
    this.#status = Game.statuses.playing;
  }

  // Add your own methods here

  // #region function-tools
  // --> shift of values in the row and + addition of values
  #shiftDirection(row) {
    const nonZeroValues = row.filter((el) => el > 0);
    const updatedArray = [];

    for (let i = 0; i < nonZeroValues.length; i++) {
      const currNum = nonZeroValues[i];
      const nextNum = nonZeroValues[i + 1];

      if (i === nonZeroValues.length - 1) {
        updatedArray.push(currNum);
        break;
      }

      if (currNum === nextNum) {
        const sum = currNum + nextNum;

        updatedArray.push(sum);
        this.#score += sum;
        i++;
      } else {
        updatedArray.push(currNum);
      }
    }

    const newValidArray = [];

    for (let i = 0; i < this.#size; i++) {
      const curr = updatedArray[i];

      newValidArray.push(typeof curr === 'number' ? curr : 0);
    }

    const beforRow = row.join(',');
    const afterRow = newValidArray.join(',');
    const isChange = beforRow !== afterRow;

    return {
      newValidArray,
      isChange,
    };
  }
  // --> random position of Numbers on the board
  #generateRandomPositions() {
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

    // var coordinate for position of Number on the board
    const randomIndex = Math.floor(Math.random() * cellPosition.x.length);
    const coorX = cellPosition.x[randomIndex];
    const coorY = cellPosition.y[randomIndex];

    this.board[coorX][coorY] = this.#getRandomNumbers();
  }

  // --> randoms numbers 2 or (4 - 10% chance)
  #getRandomNumbers() {
    if (this.#status === Game.statuses.idle) {
      return 2;
    } else {
      return Math.random() > 0.1 ? 2 : 4;
    }
  }

  // --> scaning board and change the status-game
  #checkGameStatus() {
    let hasEmptyCells = false;
    let hasPossibleMerges = false;

    for (let y = 0; y < this.#size; y++) {
      for (let x = 0; x < this.#size; x++) {
        const bottomNeighbor =
          y > this.#size - 2 ? undefined : this.board[y + 1][x];
        const currentValue = this.board[y][x];
        const rightNeighbor =
          x > this.#size - 2 ? undefined : this.board[y][x + 1];

        if (currentValue === 2048) {
          this.#status = Game.statuses.win;

          return;
        }

        if (currentValue === 0) {
          hasEmptyCells = true;
        }

        if (currentValue === rightNeighbor || currentValue === bottomNeighbor) {
          hasPossibleMerges = true;
        }
      }
    }

    if (!hasEmptyCells && !hasPossibleMerges) {
      this.#status = Game.statuses.lose;
    }
  }
  // #endregion function-tools
}

const game = new Game();

game.restart();
// game.moveLeft();
// game.moveRight();
// game.moveUp();
// game.moveLeft();
// game.moveUp();
// game.getScore();

// module.exports = Game;
export default Game;
