import { Router } from 'express';
import { invalidateCache, makeCache } from '../cache';
import Category from '../database/models/Category';
import { categoryScheme } from '../model/schemas';
import { isAdmin, verify } from './verify';

const categoriesRouter = Router();

categoriesRouter.get(`/all`, makeCache(`allCategories`, 1000 * 60 * 30, async (req: Request) => {
    return (await Category.find({})).map((e: any) => {
        return {
            name: e.name,
            description: e.description,
            id: e._id
        }
    });
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
    try {
        await Category.create(req.body)
    } catch (e) {
        res.status(500).send({
            error: `Category already exists.`
        })
        return
    }
    invalidateCache(`allCategories`)
    res.status(204).send()
})

categoriesRouter.patch(`/:name`, [verify, isAdmin], async (req, res) => {
    const { error } = categoryScheme.validate(req.body)
    if (error != undefined) {
        res.status(400).send({
            message: `Validation error`,
            error: error
        })
        return
    }
    
    const document = await Category.findOne({
        name: req.params.name
    });

    if (document == undefined) {
        res.status(404).send({
            error: `Not Found`
        })
        return
    }

    (document as any).description = req.body.description;
    (document as any).name = req.body.name;
    await document.save()
    invalidateCache(`allCategories`)
    res.status(204).send()
})

categoriesRouter.delete(`/:name`, [ verify, isAdmin ], async (req, res) => {
    const document = await Category.findOne({
        name: req.params.name
    });

    if (document == undefined) {
        res.status(404).send({
            error: `Not Found`
        })
        return
    }

    await document.delete();
    invalidateCache(`allCategories`)
    res.status(204).send()
})

export default categoriesRouter;
