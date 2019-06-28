import {Game} from './game';
import GameUtils from './gameUtils';

test('Winning with a horizontal sequence', () => {
  const moves = GameUtils.movify([0, 0, 1, 1, 2, 2]);
  const game = new Game({
    players: ['a', 'b'],
    columns: 4,
    rows: 4,
    moves,
  });
  const nextIndex = moves.length;
  const moveIndex = game.newMove('a', 3);
  expect(moveIndex).toBe(nextIndex);
  expect(game.winner).toBe(0);
  expect(game.isLive()).toBe(false);
});

test('Winning with a vertical sequence', () => {
  const moves = GameUtils.movify([2, 1, 2, 1, 0, 1, 3]);
  const game = new Game({
    players: ['a', 'b'],
    columns: 4,
    rows: 4,
    moves,
  });
  const nextIndex = moves.length;
  const moveIndex = game.newMove('b', 1);
  expect(moveIndex).toBe(nextIndex);
  expect(game.winner).toBe(1);
  expect(game.isLive()).toBe(false);
});

test('Winning with a positive diagonal sequence', () => {
  const moves = GameUtils.movify([0, 1, 1, 2, 2, 3, 3, 3, 3, 0]);
  const game = new Game({
    players: ['a', 'b'],
    columns: 4,
    rows: 4,
    moves,
  });
  const nextIndex = moves.length;
  const moveIndex = game.newMove('a', 2);
  expect(moveIndex).toBe(nextIndex);
  expect(game.winner).toBe(0);
  expect(game.isLive()).toBe(false);
});

test('Winning with a negative diagonal sequence', () => {
  const moves = GameUtils.movify([2, 3, 1, 2, 3, 3, 1, 1, 0, 0, 0]);
  const game = new Game({
    players: ['a', 'b'],
    columns: 4,
    rows: 4,
    moves,
  });
  const nextIndex = moves.length;
  const moveIndex = game.newMove('b', 0);
  expect(moveIndex).toBe(nextIndex);
  expect(game.winner).toBe(1);
  expect(game.isLive()).toBe(false);
});
