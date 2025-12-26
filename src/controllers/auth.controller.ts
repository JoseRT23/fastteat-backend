import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

const login = (req: Request, res: Response, next: NextFunction) => {
    authService.login(req.body)
        .then(token => {
            res.cookie('token', token, { 
                httpOnly: true, 
                sameSite: 'strict', 
                secure: process.env.NODE_ENV === 'production',
            });
            res.status(200).json({ token });
        })
        .catch(error => next(error));
};

const changePassword = (req: Request, res: Response, next: NextFunction) => {
    const user_id = "42e894c6-1731-4893-9a39-49e9e3039039";

    authService.changePassword(user_id, req.body)
        .then(data => res.status(200).json(data))
        .catch(error => next(error));
};

export default {
    login,
    changePassword,
}