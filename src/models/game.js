const DEF_COLS = 4;
const DEF_ROWS = 4;
const MOVE = 'MOVE';
const QUIT = 'QUIT';
export const STATE_LIVE = 'IN PROGRESS';
export const STATE_DEAD = 'DONE';

// const newBoard = (x, y) => {
//   const board = new Array[x];
//   for (let i = 0; i < x; i++) {
//     board[i] = new Array[y];
//   }
//   return board;
// };

const getOtherPlayer = (playerIndex) => {
  return 1 - playerIndex;
};

const replayMoves = (cols, moves) => {
  const board = new Array[cols];
  let nextPlayer = 0;
  moves.forEach((move) => {
    if (move.type == MOVE) {
      board[move.column].push(nextPlayer);
      nextPlayer = getOtherPlayer(nextPlayer);
    }
  });
  return { board, nextPlayer };
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

export default class Game {

  constructor(players, columns, rows) {
    this.players = players;
    this.columns = columns || DEF_COLS;
    this.rows = rows || DEF_ROWS;
    this.state = STATE_LIVE;
    this.moves = [];
    this.nextPlayer = 0;
    this.winner = null;
  }

  newMove(player, column) {
    const playerIndex = validatePlayer(this.players, player);
    if (this.state == STATE_DEAD) {
      // TODO: Error: Game is over
    }
    // columns are given in index base 1
    if (column < 1 || column > this.columns) {
      // TODO: Error: Invalid move
    }
    column--;
    const { board, nextPlayer } = replayMoves(this.columns, this.moves);
    if ( nextPlayer !=  playerIndex) {
      // TODO: Error: not player's turn
    }
    if (board[column].length == this.rows) {
      // TODO: Error: column is full
    }
    this.moves.push({
      type: MOVE,
      player: playerIndex,
      column,
    });
    if (isWinningMove(board)) {
      this.winner = playerIndex;
      this.state = STATE_DEAD;
    } else if (this.moves.length == this.rows * this.cols) {
      this.state = STATE_DEAD;
    }
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

  // set gameId(id) {
  //   this.id = id;
  // }

  // get state() {
  //   const state = {
  //     players: this.players,
  //     state: this.state,
  //   }
  //   if (this.state == STATE_1) {
  //     state.winner = this.winner;
  //   }
  //   return state;
  // }

}

