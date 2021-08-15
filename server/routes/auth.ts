import * as express from 'express';
import crypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, refreshSchema } from '../model/schemas';
import User, { UserType } from '../database/models/User';
import config from '../config.json';
import { Address6 } from 'ip-address';
import { verify } from './verify';

const authRouter = express.Router();

authRouter.get('/', (req, res) => {
    res.status(200).send('Auth Running correctly!');
});

authRouter.post('/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        res.status(400).send(error.toString());
        return;
    }

    const salt = await crypt.genSalt(config.saltLenght);

    const nameExist = await User.exists({ username: req.query.username });
    if (nameExist) {
        res.status(200).json({
            status: "error",
            error: "Error: Already registered!"
        });
        return;
    }

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await crypt.hash('' + req.body.password, salt),
        isAdmin: false
    })

    try {
        await user.save();
        res.status(200).send('Succes!');
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send("Error: Unexpected Server Error");
        return;
    }
});

authRouter.post('/login', async (req, res) => {
    const ip = new Address6(req.socket.remoteAddress).to4().address;

    const { error } = loginSchema.validate(req.body)
    if (error) {
        res.status(400).send(error.toString());
        return;
    }

    const userRef: UserType = await User.findOne({ username: req.body.username }) as any;

    if (userRef == null || userRef == undefined) {
        res.status(400).send("Error: Email or password is wrong!");
        return;
    }

    const match = await crypt.compare(req.body.password, userRef.password);
    if (match) {
        const token = jwt.sign({ _id: userRef._id, date: Date.now(), ip: ip }, config.token_secret);
        userRef.password = `secret`
        res.header('auth-token', token).json({
            token: token,
            refresh: config.token_timeout,
            user: userRef
        });
    } else {
        res.status(403).send('Error: WrongPassword');
    }
});

authRouter.post('/refresh', verify, async (req, res) => {
    const { error } = refreshSchema.validate(req.query)
    if (error) {
        res.status(500).send(error.toString());
        return;
    }

    const userRef = await User.findOne({ name: req.query.username });
    const tokenUser = await User.findById((req as any).user._id);

    if (req.query.token != req.header('auth-token')) {
        res.status(403).send("Error: Username or token is wrong!");
        return;
    }

    if (userRef == null || userRef == undefined || tokenUser == null || tokenUser == undefined) {
        res.status(403).send("Error: Username or token is wrong!");
        return;
    }

    if ((userRef.toObject() as any).name != (tokenUser.toObject() as any).name) {
        res.status(403).send("Error: Username or token is wrong!");
        return;
    }

    if (req.query.isAdmin == 'true' && !((tokenUser.toObject() as any).isAdmin || false)) {
        res.setHeader('X-Nice-Try', 'Nerd')
        res.status(403).send('Error: This will not work!');
        return;
    }

    const token = jwt.sign({ _id: userRef._id, date: Date.now() }, config.token_secret);
    res.header('auth-token', token).json({
        token: token,
        refresh: config.token_timeout
    });
})

export default authRouter;
