import GameUtils from './gameUtils';

const DEF_COLS = 4;
const DEF_ROWS = 4;

export const MOVE = 'MOVE';
export const QUIT = 'QUIT';
export const STATE_LIVE = 'IN PROGRESS';
export const STATE_DEAD = 'DONE';

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
    if (this.state == STATE_DEAD) {
      // TODO: Error: Game is over
    }
    if ( this.nextPlayer !=  playerIndex) {
      // TODO: Error: not player's turn
    }
    if (column < 0 || column >= this.columns) {
      // TODO: Error: Invalid move
    }
    let board = GameUtils.replayMoves(this.columns, this.moves);
    if (board[column].length == this.rows) {
      // TODO: Error: column is full
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
      // TODO: Error: Game already ended
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
    const playerIndex = this.players.indexOf(playerName);
    if (playerIndex == -1) {
      // TODO: Error: player not part of game
    }
    return playerIndex;
  }

  hasPlayer(playerName) {
    return this.players.indexOf(playerName) != -1;
  }

  isLive() {
    return this.state == STATE_LIVE;
  }

}

