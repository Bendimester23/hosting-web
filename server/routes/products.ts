import { Router } from 'express';
import { invalidateCache, makeCache } from '../cache';
import Product from '../database/models/Product';
import { isAdmin, verify } from './verify';
const productsRouter = Router();

productsRouter.get(`/all`, makeCache(`allProducts`, 3600, async (req: Request) => {
    return await Product.find({});
}));

productsRouter.get(`/categories`, (req, res) => {
    res.send([])
})

productsRouter.put(`/new`, [ verify, isAdmin ], (req, res) => {
    invalidateCache(`allProducts`)
//    Product.create({
//        
//    })
})

export default productsRouter;
