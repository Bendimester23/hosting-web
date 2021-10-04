import * as express from 'express';
import crypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../model/schemas';
import User, { UserType } from '../database/models/User';
import config from '../config.json';
import { verify } from './verify';
import axios  from 'axios';
import { emailVerify, mailData } from '../config.json'
import {mail} from "../index";
import {Document} from "mongoose";

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


    const nameExist = await User.exists({ username: req.body.username });
    if (nameExist) {
        res.status(409).json({
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
        emailVerify ? res.status(201).send(`VERIFY`) : res.status(201).send('Succes!');
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({
            error: `error saving user`
        });
        return;
    }
});

authRouter.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if (error) {
        res.status(400).send(error);
        return;
    }

    const userRef = await User.findOne({ username: req.body.username }) as unknown as UserType;

    if (userRef == null) {
        res.status(404).send({
            error: `user doesn't exists`
        });
        return;
    }

    const match = await crypt.compare(req.body.password, userRef.password);
    if (match) {
        const token = jwt.sign({ _id: userRef._id, date: Date.now() }, config.token_secret);
        userRef.password = `secret`
        res.json({
            token: token,
            refresh: config.token_timeout,
            user: userRef
        });
    } else {
        res.status(403).send('Error: WrongPassword');
    }
});

authRouter.get('/refresh', verify, async (req, res) => {
    const tokenUser = await User.findById((req as any).user._id) as unknown as UserType;

    if (tokenUser == null) {
        res.status(404).send({
            error: `user not found`
        });
        return;
    }

    if (req.query.isAdmin == `true`) {
        res.setHeader(`X-Nice-Try`, `Nerd`)
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

authRouter.get(`/verify/:email/:code`, async (req, res) => {
    if (!req.params.code.match(/\d{6}/g)) {
        res.status(400).send({
            error: `Invalid code`
        })
        return
    }
    const user: Document = await User.findOne({
        verifyCode: req.params.code,
        email: req.params.email,
        verified: false
    })

    if (user == null) {
        res.status(404).send({
            error: `No user found with email & code`
        })
        return
    }

    (user as unknown as UserType).verified = true;
    try {
        await user.save()
    } catch (e) {
        res.status(500).send({
            error: `Error saving user`
        })
        return
    }
    res.status(200).send({
        status: `Verify successful`
    })
})

export default authRouter;
