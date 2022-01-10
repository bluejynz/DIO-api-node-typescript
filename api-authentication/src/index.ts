import express, { NextFunction, Request, Response } from 'express';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log('App executando na porta 3000');
});

app.use(usersRoute);
app.use(statusRoute);
