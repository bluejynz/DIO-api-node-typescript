import { NextFunction, Request, Response, Router } from 'express';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import ForbiddenError from '../models/errors/forbidden.error.model';


const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if(!user)
            throw new ForbiddenError('Usuário não informado');
        
        const jwt = JWT.sign({ username: user.username }, 'my_secret_key', { subject: user?.uuid });
        res.status(StatusCodes.OK).send({ token: jwt });
    } catch(error) {
        next(error);
    }
});

export default authorizationRoute;
