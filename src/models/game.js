import GameUtils from './gameUtils';

const DEF_COLS = 4;
const DEF_ROWS = 4;

export const MOVE = 'MOVE';
export const QUIT = 'QUIT';
export const STATE_LIVE = 'IN PROGRESS';
export const STATE_DEAD = 'DONE';
export const ERRORS = {
  INVALID_PLAYER: 'Invalid player',
  GAME_OVER: 'Game is over',
  WRONG_TURN: 'Not player\'s turn',
  INVALID_MOVE: 'Not a valid move',
};

const getOtherPlayer = (playerIndex) => {
  return 1 - playerIndex;
};

const makeMove = (move, board) => {
  board[move.column].push(move.player);
  return board;
};

export class Game {

  constructor(data) {
    this.players = data.players;
    this.columns = data.columns || DEF_COLS;
    this.rows = data.rows || DEF_ROWS;
    this.state = data.state || STATE_LIVE;
    this.moves = data.moves || [];
    this.nextPlayer = data.nextPlayer || 0;
    this.winner = data.winner || null;
    this.gameId = data.gameId;
    this.createDate = data.createDate;
  }

  newMove(player, column) {
    const playerIndex = this.getPlayerIndex(player);
    if (playerIndex == -1) {
      const err = new Error(ERRORS.INVALID_PLAYER);
      err.statusCode = 404;
      return err;
    }
    if (this.state == STATE_DEAD) {
      const err = new Error(ERRORS.GAME_OVER);
      err.statusCode = 400;
      return err;
    }
    if (this.nextPlayer !=  playerIndex) {
      const err = new Error(ERRORS.WRONG_TURN);
      err.statusCode = 409;
      return err;
    }
    if (column < 0 || column >= this.columns) {
      const err = new Error(ERRORS.INVALID_MOVE);
      err.statusCode = 400;
      return err;
    }
    let board = GameUtils.replayMoves(this.columns, this.moves);
    if (board[column].length == this.rows) {
      const err = new Error(ERRORS.INVALID_MOVE);
      err.statusCode = 400;
      return err;
    }
    const move = {
      type: MOVE,
      player: playerIndex,
      column,
    };
    // Make the move
    board = makeMove(move, board);
    // Record it
    this.moves.push(move);

    if (GameUtils.isWinningMove(move, board)) {
      this.winner = playerIndex;
      this.state = STATE_DEAD;
    } else if (this.moves.length == this.rows * this.cols) {
      this.state = STATE_DEAD;
    }
    this.nextPlayer = getOtherPlayer(playerIndex);
    GameUtils.renderBoard(board);
    return this.moves.length - 1;
  }

  quit(player) {
    const playerIndex = this.getPlayerIndex(player);
    if (this.state == STATE_DEAD) {
      const err = new Error(ERRORS.GAME_OVER);
      err.statusCode = 410;
      return err;
    }
    this.moves.push({
      type: QUIT,
      player: playerIndex,
    });
    this.state = STATE_DEAD;
    this.nextPlayer = null;
    this.winner = getOtherPlayer(playerIndex);
  }

  getPlayerName(index) {
    return this.players[index];
  }

  getPlayerIndex(playerName) {
    return this.players.indexOf(playerName);
  }

  hasPlayer(playerName) {
    return this.getPlayerIndex() != -1;
  }

  isLive() {
    return this.state == STATE_LIVE;
  }

}

