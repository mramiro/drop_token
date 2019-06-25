import express from 'express';

const router = express.Router();

// GET list of games
router.get('/', (req, res) => {
  const games = [ 1, 2 ];
  res.send(games);
});

// POST new game
router.post('/', (req, res) => {
  const game = { id: '123' };
  res.send(game);
});

// GET a game's state
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const game = { id };
  res.send(game);
});

// POST a new move
router.post('/:id/:playerId', (req, res) => {
  const { id, playerId } = req.params;
  const moveNumber = 1;
  const move = `/${id}/moves/${moveNumber}`;
  res.status(201).send(move);
});

// DELETE a player from a game (resign)
router.delete('/:id/:playerId', (req, res) => {
  const { id, playerId } = req.params;
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
