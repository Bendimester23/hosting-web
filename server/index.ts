import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connect from './database/connect';
import morgan from 'morgan';
import bodyparser from 'body-parser';

import * as CONFIG from './config.json';

//Routes
import authRouter from './routes/auth';

const app = express();

console.log('Starting API!')

app.get('/', (req,res) => {
    res.status(200).send('API running!');
})

app.use(helmet());
app.use(cors());
app.use(bodyparser());
app.use(morgan("dev"));
app.use('/auth', authRouter);

app.listen(CONFIG.port, () => console.log(`[HTTP] Server is running on port ${CONFIG.port}!`));
connect(CONFIG.connection_url);