import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/errors/custom.errors";

export const handleError = (error: unknown, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof CustomError) {
        if (error.statusCode === undefined) {
            res.status(500).json({ message: 'Internal server error' });
            next();
            return;
        }
        
        res.status(error.statusCode).json({ message: error.message });
        next();
        return;
    }
    
    const unknownError = error as Error;
    console.log(`ENDPOINT => ${req.url}`);
    console.log(`${unknownError}`);
    if (unknownError.name === 'PrismaClientKnownRequestError') {
        res.status(400).json({ message: 'Database request error' });
        next();
        return;
    }
    res.status(500).json({ message: 'Internal server error' });
}
