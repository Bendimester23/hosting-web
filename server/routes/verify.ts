import { NextFunction } from 'express';
import { Address6 } from 'ip-address';
import jwt from 'jsonwebtoken';
import config from '../config.json';
import User, { UserType } from '../database/models/User';

export function verify(req, res, next: NextFunction) {
    const ip = new Address6(req.socket.remoteAddress).to4().address;

    const token = req.header('Authorization');
    if (!token) return res.status(403).send('Error: No token provided!');

    try {
        const verified: any = jwt.verify(token, config.token_secret);

        const expire: number = verified.date + (config.token_timeout * 1000);
        if (expire < Date.now()) {
            return res.status(403).send("Error: Acces Denied: Expired token!");
        }
        //if (verified.ip != ip) {
        //    return res.status(403).send("Error: Acces Denied: Wrong IP!");
        //}
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