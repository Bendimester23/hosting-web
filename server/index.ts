import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connect from './database/connect';
import morgan from 'morgan';
import { createTransport } from "nodemailer";
import { emailVerify, mailTransport, mailData } from './config.json'

// eslint-disable-next-line @typescript-eslint/camelcase
import { port, connection_url, schemas } from './config.json';

//Routes
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import categoriesRouter from './routes/category';
import usersRouter from "./routes/users";

export let mail;

if (emailVerify) {
    mail = createTransport(mailTransport)
}

const app = express();

console.log('Starting API!')

app.get('/', (_, res) => {
    res.status(200).send('API running!');
})

app.use(helmet());
app.use(cors());
app.use(json());
app.use(morgan("dev"));
app.use('/auth', authRouter);
app.use(`/products`, productsRouter)
app.use(`/category`, categoriesRouter)
app.use(`/users`, usersRouter)

app.get(`/config`, (req, res) => res.send(schemas))

app.listen(port, () => console.log(`[HTTP] Server is running on port ${port}!`));
connect(connection_url);