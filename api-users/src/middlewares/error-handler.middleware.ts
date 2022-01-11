import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DatabaseError from "../models/errors/database.error.model";

function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if(error instanceof DatabaseError)
        res.status(StatusCodes.BAD_REQUEST).send(error);
    else
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
}

export default errorHandler;
