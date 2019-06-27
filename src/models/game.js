const DEF_COLS = 4;
const DEF_ROWS = 4;
const MOVE = 'MOVE';
const QUIT = 'QUIT';
export const STATE_LIVE = 'IN PROGRESS';
export const STATE_DEAD = 'DONE';

const getOtherPlayer = (playerIndex) => {
  return 1 - playerIndex;
};

const makeMove = (move, board) => {
  board[move.column].push(move.player);
  return board;
};

const replayMoves = (cols, moves) => {
  const board = [];
  for (let i = 0; i < cols; i++) {
    board[i] = [];
  }
  moves.forEach((move) => {
    if (move.type == MOVE) {
      board[move.column].push(move.player);
    }
  });
  return board;
};

const validatePlayer = (players, player) => {
  const playerIndex = players.indexOf(player);
  if (playerIndex == -1) {
    // TODO: Error: player not part of game
  }
  return playerIndex;
};

const isWinningMove = (board) => {
  // TODO: Check winning condition
  return false;
};

const renderBoard = (board) => {
  let line
  for (let i = 3; i >= 0; i--) {
    line = [];
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] !== undefined) {
        line.push(board[j][i]);
      } else {
        line.push('-');
      }
    }
    console.log(line.join(' '));
  }
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
    const playerIndex = validatePlayer(this.players, player);
    if (this.state == STATE_DEAD) {
      // TODO: Error: Game is over
    }
    if ( this.nextPlayer !=  playerIndex) {
      // TODO: Error: not player's turn
    }
    // columns are given in index base 1
    if (column < 1 || column > this.columns) {
      // TODO: Error: Invalid move
    }
    column--;
    let board = replayMoves(this.columns, this.moves);
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

    if (isWinningMove(board)) {
      this.winner = playerIndex;
      this.state = STATE_DEAD;
    } else if (this.moves.length == this.rows * this.cols) {
      this.state = STATE_DEAD;
    }
    this.nextPlayer = getOtherPlayer(playerIndex);
    renderBoard(board);
    return this.moves.length - 1;
  }

  quit(player) {
    const playerIndex = validatePlayer(this.players, player);
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

  isLive() {
    return this.state == STATE_LIVE;
  }

  hasPlayer(playerName) {
    return this.players.indexOf(playerName) != -1;
  }

}

