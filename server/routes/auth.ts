import * as express from 'express';
import crypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../model/schemas';
import User, { UserType } from '../database/models/User';
import config from '../config.json';
import { Address6 } from 'ip-address';
import { verify } from './verify';
import axios  from 'axios';
import { emailVerify, mailData } from '../config.json'
import {mail} from "../index";

const authRouter = express.Router();

authRouter.get('/', (req, res) => {
    res.status(200).send('Auth Running correctly!');
});

function genVerifyCode() {
    let res = ``;
    const set = `1234567890`.split(``);

    for (let i = 0; i < 6; i++) {
        res += set[Math.floor(Math.random()*set.length)]
    }
    return res;
}

function sendVerifyEmail(email: string, code: string) {
    mail.sendMail({
        from: mailData.from,
        to: email,
        subject: mailData.subject,
        text: `Megerősítő kód: ${code}`
    })
}

authRouter.post('/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error) {
        res.status(400).send(error);
        return;
    }

    try {
        const { data } = await axios.post(`https://hcaptcha.com/siteverify`, `response=${req.body.captcha}&secret=${config.captchaKey}`,{
            headers: {
                "Content-Type": `application/x-www-form-urlencoded`
            }
        })
        if (data.success != true) {
            res.status(403).send({
                error: `BAD_CAPTCHA`
            })
            return
        }
    } catch (e) {
        res.status(403).send({
            error: `BAD_CAPTCHA`
        })
        return
    }


    const nameExist = await User.exists({ username: req.query.username });
    if (nameExist) {
        res.status(200).json({
            status: "error",
            error: "Error: Username already taken!"
        });
        return;
    }

    const verifyCode = emailVerify ? genVerifyCode() : ``

    const salt = await crypt.genSalt(config.saltLenght);
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await crypt.hash(req.body.password, salt),
        isAdmin: false,
        verified: !emailVerify,
        verifyCode
    })

    try {
        await user.save();

        sendVerifyEmail(req.body.email, verifyCode)
        emailVerify ? res.status(200).send(`VERIFY`) : res.status(200).send('Succes!');
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
        res.status(400).send(error);
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
        res.header('Authorizaton', token).json({
            token: token,
            refresh: config.token_timeout,
            user: userRef
        });
    } else {
        res.status(403).send('Error: WrongPassword');
    }
});

authRouter.get('/refresh', verify, async (req, res) => {
    const tokenUser: UserType = await User.findById((req as any).user._id) as any;

    if (tokenUser == null || tokenUser == undefined) {
        res.status(403).send("Error: Username or token is wrong!");
        return;
    }

    if (req.query.isAdmin == 'true') {
        res.setHeader('X-Nice-Try', 'Nerd')
        res.status(403).send('Error: This will not work!');
        return;
    }

    const token = jwt.sign({ _id: tokenUser._id, date: Date.now() }, config.token_secret);
    tokenUser.password = `***`
    res.header('Authorization', token).json({
        token: token,
        refresh: config.token_timeout,
        user: tokenUser
    });
})

export default authRouter;
