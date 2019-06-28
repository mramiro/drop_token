import Joi from 'joi';

const validation = {};

validation.newGame = {
  body: {
    players: Joi.array().length(2).items(Joi.string()).required(),
    columns: Joi.number().integer(),
    rows: Joi.number().integer(),
  }
};

validation.newMove = {
  body: {
    column: Joi.number().integer().required(),
  }
};

validation.getMoves = {
  query: {
    start: Joi.number().integer().min(0).default(0),
    until: Joi.number().integer().positive(),
  }
};

export default validation;
