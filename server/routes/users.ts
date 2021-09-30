import * as express from 'express';
import User, { UserType } from '../database/models/User';

const usersRouter = express.Router();

usersRouter.get('/all', async (req, res) => {
    const users = await User.find({});
    res.status(200).send(users);
});

usersRouter.get(`/makeAdmin`, async (req, res) => {
    const user: any = await User.findById(req.query.id);
    user.isAdmin = true;

    await user.save();

    res.send({
        status: `success`
    })
})

export default usersRouter;
