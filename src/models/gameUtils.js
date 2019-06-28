import {MOVE} from './game';

const LENGTH_TO_WIN = 4;

export default class GameUtils {

  // Turns a sequence of column indexes into a list
  // of fully qualified "move" objects
  static movify(columns) {
    return columns.map((item, index) => {
      return {
        type: MOVE,
        column: item,
        player: index % 2,
      };
    });
  }

  static replayMoves(cols, moves) {
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
  }

  static renderBoard(board) {
    let lines = [];
    for (let i = 3; i >= 0; i--) {
      let line = [];
      for (let j = 0; j < board.length; j++) {
        if (board[j][i] !== undefined) {
          line.push(board[j][i]);
        } else {
          line.push('-');
        }
      }
      lines.push(line.join(' '));
    }
    console.log(lines.join("\n"));
  };


  static isWinningMove(move, board) {
    // We store the position of the last move
    const x = move.column;
    const y = board[move.column].length - 1;
    const player = move.player;
    const range = LENGTH_TO_WIN - 1;
    let i, ctr;
    // Horizontal check (x = k)
    ctr = 0;
    for (i = Math.max(x - range, 0); i < Math.min(x + range, board.length); i++) {
      if (board[i][y] === player) {
        ctr++;
        if (ctr == LENGTH_TO_WIN) {
          return true;
        }
      }
      else {
        ctr = 0;
      }
    }
    // Vertical check (y = k)
    // Verticals are easier because we only have to count from the last move down
    // (tokens only fall down from the top, so we can guarantee that there's nothing above the last placed token)
    ctr = 1;
    for (i = y - 1; i >= y - range; i--) {
      if (board[x][i] === player) {
        ctr++;
      } else {
        break;
      }
      if (ctr == LENGTH_TO_WIN) {
        return true;
      }
    }
    // Positive diagonal (y = x)
    ctr = 1;
    let leftX = x, rightX = x;
    let leftY = y, rightY = y;
    let canGoLeft = true;
    let canGoRight = true;
    while (canGoLeft || canGoRight) {
      if (canGoLeft) {
        leftX--;
        leftY--;
        if (leftX >= 0 && leftY >= 0 && board[leftX][leftY] === player) {
          ctr++;
        } else {
          canGoLeft = false;
        }
      }
      if (canGoRight) {
        rightX++;
        rightY++;
        if (
          rightX < board.length && rightY < board[rightX].length
          && board[rightX][rightY] === player
        ) {
          ctr++;
        } else {
          canGoRight = false;
        }
      }
      if (ctr >= LENGTH_TO_WIN) {
        return true;
      }
    } 
    // Negative diagonal (y = -x)
    ctr = 1;
    leftX = x, rightX = x;
    leftY = y, rightY = y;
    canGoLeft = true;
    canGoRight = true;
    while (canGoLeft || canGoRight) {
      if (canGoLeft) {
        leftX--;
        leftY++;
        if (
          leftX >= 0 && leftY < board[leftX].length
          && board[leftX][leftY] === player
        ) {
          ctr++;
        } else {
          canGoLeft = false;
        }
      }
      if (canGoRight) {
        rightX++;
        rightY--;
        if (
          rightX < board.length && rightY >= 0
          && board[rightX][rightY] === player
        ) {
          ctr++;
        } else {
          canGoRight = false;
        }
      }
      if (ctr >= LENGTH_TO_WIN) {
        return true;
      }
    } 
    return false;
  }

}
