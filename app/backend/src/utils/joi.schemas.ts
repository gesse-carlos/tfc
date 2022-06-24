import * as Joi from 'joi';

const emptyLogin = '401|All fields must be filled';

export const login = Joi.object({
  email: Joi.string().required().messages({
    'string.base': '422|Email must be a string',
    'string.empty': emptyLogin,
    'any.required': emptyLogin,
  }),
  password: Joi.string().required().messages({
    'string.base': '422|Password must be a string',
    'string.empty': emptyLogin,
    'any.required': emptyLogin,
  }),
});

export const match = Joi.object({
  homeTeam: Joi.number().positive().required().messages({
    'number.base': '422|Home Team must be a positive integer',
    'number.positive': '422|Home Team must be a positive integer',
    'any.required': '400|Home Team must be provided',
  }),
  awayTeam: Joi.number().positive().required().messages({
    'number.base': '422|Away Team must be a positive integer',
    'number.positive': '422|Away Team must be a positive integer',
    'any.required': '400|Away Team must be provided',
  }),
  homeTeamGoals: Joi.number().positive().required().messages({
    'number.base': '422|Home Team Goals must be a positive integer',
    'number.positive': '422|Home Team Goals must be a positive integer',
    'any.required': '400|Home Team Goals must be provided',
  }),
  awayTeamGoals: Joi.number().positive().required().messages({
    'number.base': '422|Away Team Goals must be a positive integer',
    'number.positive': '422|Away Team Goals must be a positive integer',
    'any.required': '400|Away Team Goals must be provided',
  }),
  inProgress: Joi.boolean().valid(true).required().messages({
    'any.required': '400|In Progress must be provided as true',
    'any.only': '422|In Progress must be provided as true',
  }),
});
