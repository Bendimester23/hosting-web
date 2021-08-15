import { Router } from 'express';
import { invalidateCache, makeCache } from '../cache';
import Category from '../database/models/Category';
import { categoryScheme } from '../model/schemas';
import { isAdmin, verify } from './verify';

const categoriesRouter = Router();

categoriesRouter.get(`/all`, makeCache(`allCategories`, 3600, async (req: Request) => {
    return await Category.find({});
}));

categoriesRouter.put(`/new`, [ verify, isAdmin ], async (req: Request, res) => {
    const { error } = categoryScheme.validate(req.body)
    if (error != undefined) {
        res.status(400).send({
            message: `Validation error`,
            error: error
        })
        return
    }
    invalidateCache(`allCategories`)
    await Category.create(req.body)
    res.send({
        status: `Success`
    })
})

export default categoriesRouter;
