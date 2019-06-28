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

export default validation;
