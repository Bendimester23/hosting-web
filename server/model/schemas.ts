import Joi from '@hapi/joi';

import { schemas } from '../config.json';

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(schemas.username.min)
        .max(schemas.username.max)
        .required(),
    email: Joi.string()
        .min(schemas.email.min)
        .max(schemas.email.max)
        .required()
        .email(),
    password: Joi.string()
        .min(schemas.password.min)
        .max(schemas.password.max)
        .required()
});

export const loginSchema = Joi.object({
    username: Joi.string()
        .min(schemas.username.min)
        .max(schemas.username.max)
        .required(),
    password: Joi.string()
        .min(schemas.password.min)
        .max(schemas.password.max)
        .required()
});

export const productScheme = Joi.object({
    name: Joi.string()
        .required()
        .min(schemas.product.name.min)
        .max(schemas.product.name.max),
    description: Joi.string()
        .required()
        .min(schemas.product.description.min)
        .max(schemas.product.description.max),
    features: Joi.array()
        .items(
            Joi.string()
                .min(schemas.product.feaures.min)
                .max(schemas.product.feaures.max)
        )
        .required(),
    notIncluded: Joi.array()
        .items(
            Joi.string()
                .min(schemas.product.feaures.min)
                .max(schemas.product.feaures.max)
        )
        .required(),
    image: Joi.string()
        .uri(),
    isLimitedStock: Joi.boolean()
        .required(),
    stock: Joi.number()
        .default(-1),
    price: Joi.object({
        currency: Joi.string()
            .min(3)
            .max(3)
            .required(),
        amount: Joi.number()
            .positive()
            .default(0)
    }),
    category: Joi.string()
        .required()
})

export const categoryScheme = Joi.object({
    name: Joi.string()
        .required()
        .min(schemas.category.name.min)
        .max(schemas.category.name.max),
    description: Joi.string()
        .required()
        .min(schemas.category.description.min)
        .max(schemas.category.description.max),
    hidden: Joi.boolean()
        .default(false)
})
