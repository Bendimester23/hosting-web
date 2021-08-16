import { Router } from 'express';
import { invalidateCache, makeCache } from '../cache';
import Category from '../database/models/Category';
import { categoryScheme, editCategoryScheme } from '../model/schemas';
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
    res.send({
        status: `Success`
    })
    invalidateCache(`allCategories`)
})

categoriesRouter.patch(`/:name`, [verify, isAdmin], async (req, res) => {
    const { error } = editCategoryScheme.validate(req.body)
    if (error != undefined) {
        res.status(400).send({
            message: `Validation error`,
            error: error
        })
        return
    }
    console.log(req.params.name);
    
    const document = await Category.findOne({
        name: req.params.name
    });

    (document as any).description = req.body;
    await document.save()
    res.send({
        status: `success`
    })
})

export default categoriesRouter;
