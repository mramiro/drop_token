import express from 'express';
import Games from '../repositories/games';

const router = express.Router();

// GET list of games
router.get('/', async (req, res) => {
  const gamesRepo = new Games();
  const result = await gamesRepo.getGames();
  res.status(result.statusCode).send(result.body);
});

// POST new game
router.post('/', async (req, res) => {
  const gamesRepo = new Games();
  const result = await gamesRepo.createGame(req.body);
  res.status(result.statusCode).send(result.body);
});

// GET a game's state
router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const gamesRepo = new Games();
  const result = await gamesRepo.getGameById(gameId);
  if (result.statusCode == 200) {
    const game = result.body;
    const slimGame = {
      players: game.players,
      state: game.state,
    };
    if (!game.isLive()) {
      game.winner = game.winner;
    }
    result.body = slimGame;
  }
  res.status(result.statusCode).send(result.body);
});

// POST a new move
router.post('/:gameId/:playerId', async (req, res) => {
  const { gameId, playerId } = req.params;
  const { column } = req.body;
  const gamesRepo = new Games();
  const { statusCode, body } = await gamesRepo.getGameById(gameId);
  const game = body;
  const moveNumber = game.newMove(playerId, column);
  const result = gamesRepo.updateGame(game);
  if (result.statusCode == 200) {
    const move = { move: `/${gameId}/moves/${moveNumber}` };
    res.send(move);
  } else {
    res.status(result.statusCode);
  }
});

// DELETE a player from a game (resign)
router.delete('/:gameId/:playerId', (req, res) => {
  const { gameId, playerId } = req.params;
  const moveNumber = 1;
  const move = `/${id}/moves/${moveNumber}`;
  res.sendStatus(202);
});

// GET a game's list of moves
router.get('/:id/moves', (req, res) => {
  const moves = [{ type: "MOVE", player: "player1", column: 2 }];
  res.send(moves);
});

// GET a specific move
router.get('/:id/moves/:index', (req, res) => {
  const move = { type: "MOVE", player: "player1", column: 2 };
  res.send(move);
});

export default router;
