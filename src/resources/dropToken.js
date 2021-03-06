import express from 'express';
import validate from 'express-validation';
import validation from './validation/dropToken';
import GameService from '../services/gameService';
import {Game} from '../models/game';

const router = express.Router();

// GET list of games
router.get('/', async (req, res) => {
  const service = new GameService();
  let games = await service.getGames();
  if (games === null) {
    games = [];
  }
  res.send(games);
});

// POST new game
router.post('/', validate(validation.newGame), async (req, res) => {
  const service = new GameService();
  const game = await service.createGame(req.body);
  res.send({ gameId: game.gameId });
});

// GET a game's state
router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const service = new GameService();
  const game = await service.getGameById(gameId);
  if (game === null) {
    res.status(404).send();
    return;
  }
  const slimGame = {
    players: game.players,
    state: game.state,
  };
  if (!game.isLive()) {
    slimGame.winner = game.getPlayerName(game.winner);
  }
  res.send(slimGame);
});

// POST a new move
router.post('/:gameId/:playerId', validate(validation.newMove), async (req, res, next) => {
  const { gameId, playerId } = req.params;
  const { column } = req.body;
  const service = new GameService();
  let game = await service.getGameById(gameId);
  if (game === null) {
    res.status(404).send();
    return;
  }
  const newMove = game.newMove(playerId, column);
  if (newMove instanceof Error) {
    return next(newMove);
  }
  game = await service.updateGame(game);
  if (game instanceof Game) {
    const move = { move: `/${gameId}/moves/${newMove}` };
    res.send(move);
  } else {
    res.status(500);
  }
});

// DELETE a player from a game (resign)
router.delete('/:gameId/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;
  const service = new GameService();
  const game = await service.getGameById(gameId);
  if (game === null || !game.hasPlayer(playerId)) {
    res.status(404).send();
    return;
  }
  if (!game.isLive()) {
    res.status(410).send();
    return;
  }
  game.quit(playerId);
  service.updateGame(game);
  res.status(202).send();
});

// GET a game's list of moves
router.get('/:gameId/moves', validate(validation.getMoves), async (req, res) => {
  const { gameId } = req.params;
  const service = new GameService();
  const game = await service.getGameById(gameId);
  if (game === null || game.moves.length == 0) {
    res.status(404).send();
    return;
  }
  const start = req.query.start;
  const until = req.query.until || game.moves.length;
  const moves = game.moves.slice(start, until).map((move) => {
    move.player = game.getPlayerName(move.player);
    return move;
  });
  res.send({ moves });
});

// GET a specific move
router.get('/:gameId/moves/:index', async (req, res) => {
  const { gameId, index } = req.params;
  const service = new GameService();
  const game = await service.getGameById(gameId);
  let i = parseInt(index);
  if (game === null || game.moves[i] === undefined) {
    res.status(404).send();
    return;
  }
  const move = game.moves[index];
  res.send({ move });
});

export default router;
