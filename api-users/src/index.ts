import express from 'express';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(statusRoute);
app.use(usersRoute);

//authenticated routes
app.use(jwtAuthenticationMiddleware);
app.use(authorizationRoute);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('App executando na porta 3000');
});
