import { NextFunction } from 'express';
import { Address6 } from 'ip-address';
import jwt from 'jsonwebtoken';
import config from '../config.json';
import User, { UserType } from '../database/models/User';

export function verify(req, res, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(403).send('Error: No token provided!');

    try {
        const verified: any = jwt.verify(token, config.token_secret);

        const expire: number = verified.date + (config.token_timeout * 1000);
        if (expire < Date.now()) {
            return res.status(403).send("Error: Acces Denied: Expired token!");
        }

        req.user = verified;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).send("Error: Invalid token!");
    }
}

export async function isAdmin(req, res, next: NextFunction) {
    const user = await User.findById(req.user._id) as unknown as UserType

    if (user?.isAdmin) next();
    else res.status(403).send("Error: Acces Denied");
}

export async function storeAdmin(req, res, next: NextFunction) {
    req.isAdmin = false
    const token = req.header('Authorization');
    if (!token) next()

    try {
        const verified: any = jwt.verify(token, config.token_secret);

        const expire: number = verified.date + (config.token_timeout * 1000);
        if (expire < Date.now()) next()

        const user = await User.findById(verified._id) as unknown as UserType

        req.isAdmin = user?.isAdmin
        next();
    } catch (error) {
        next()
    }
}
