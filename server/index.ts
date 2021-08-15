import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connect from './database/connect';
import morgan from 'morgan';

import * as CONFIG from './config.json';

//Routes
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import categoriesRouter from './routes/category';


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

app.listen(CONFIG.port, () => console.log(`[HTTP] Server is running on port ${CONFIG.port}!`));
connect(CONFIG.connection_url);