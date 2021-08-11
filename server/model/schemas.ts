import Joi from '@hapi/joi';

import * as config from '../config.json';

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(config.schemas.username.min)
        .max(config.schemas.username.max)
        .required(),
    email: Joi.string()
        .min(config.schemas.email.min)
        .max(config.schemas.email.max)
        .required()
        .email(),
    password: Joi.string()
        .min(config.schemas.password.min)
        .max(config.schemas.password.max)
        .required()
});

export const loginSchema = Joi.object({
    username: Joi.string()
        .min(config.schemas.username.min)
        .max(config.schemas.username.max)
        .required(),
    password: Joi.string()
        .min(config.schemas.password.min)
        .max(config.schemas.password.max)
        .required()
});

export const refreshSchema = Joi.object({
    username: Joi.string()
        .min(config.schemas.username.min)
        .max(config.schemas.username.max)
        .required(),
    token: Joi.string()
        .min(6)
        .max(1024)
        .required(),
    isAdmin: Joi.boolean()
        .required()
});
