import express from 'express';
import Games from '../repositories/games';

const router = express.Router();

// GET list of games
router.get('/', async (req, res) => {
  const gamesRepo = new Games();
  let games = await gamesRepo.getGames();
  if (games === null) {
    games = [];
  }
  res.send(games);
});

// POST new game
router.post('/', async (req, res) => {
  const gamesRepo = new Games();
  const game = await gamesRepo.createGame(req.body);
  res.send({ gameId: game.gameId });
});

// GET a game's state
router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const gamesRepo = new Games();
  const game = await gamesRepo.getGameById(gameId);
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
router.post('/:gameId/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;
  const { column } = req.body;
  const gamesRepo = new Games();
  let game = await gamesRepo.getGameById(gameId);
  if (game === null) {
    res.status(404).send();
    return;
  }
  const moveNumber = game.newMove(playerId, column);
  // TODO: Add errors for invalid players and moves
  game = gamesRepo.updateGame(game);
  if (game) {
    const move = { move: `/${gameId}/moves/${moveNumber}` };
    res.send(move);
  } else {
    res.status(500);
  }
});

// DELETE a player from a game (resign)
router.delete('/:gameId/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;
  const gamesRepo = new Games();
  const game = await gamesRepo.getGameById(gameId);
  if (game === null || !game.hasPlayer(playerId)) {
    res.status(404).send();
    return;
  }
  if (!game.isLive()) {
    res.status(410).send();
    return;
  }
  game.quit(playerId);
  gamesRepo.updateGame(game);
  res.status(202).send();
});

// GET a game's list of moves
router.get('/:gameId/moves', async (req, res) => {
  const { gameId } = req.params;
  const gamesRepo = new Games();
  const game = await gamesRepo.getGameById(gameId);
  if (game === null || game.moves.length == 0) {
    res.status(404).send();
    return;
  }
  let { start, until } = req.query;
  start = parseInt(start || 0);
  until = parseInt(until || -1);
  if (start < 0) {
    start = 0;
  }
  if (until < 0) {
    until = game.moves.length;
  }
  const moves = game.moves.slice(start, until).map((move) => {
    move.player = game.getPlayerName(move.player);
    return move;
  });
  res.send({ moves });
});

// GET a specific move
router.get('/:gameId/moves/:index', async (req, res) => {
  const { gameId, index } = req.params;
  const gamesRepo = new Games();
  const game = await gamesRepo.getGameById(gameId);
  let i = parseInt(index);
  if (game === null || game.moves[i] === undefined) {
    res.status(404).send();
    return;
  }
  const move = game.moves[index];
  res.send({ move });
});

export default router;
