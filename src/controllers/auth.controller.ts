import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);

        if (typeof result === 'string') {
            res.cookie('token', result, {
                httpOnly: true, 
                sameSite: 'strict', 
                secure: process.env.NODE_ENV === 'production',
            });

            return res.status(200).json({ token: result });
        }

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const businessLogin = (req: Request, res: Response, next: NextFunction) => {
    authService.businessLogin(req.body)
        .then(token => {
            res.cookie('token', token, {
                httpOnly: true, 
                sameSite: 'strict', 
                secure: process.env.NODE_ENV === 'production',
            });
            res.status(200).json({ token });
        })
        .catch(error => next(error));
}

const changePassword = (req: Request, res: Response, next: NextFunction) => {
    const user_id = "42e894c6-1731-4893-9a39-49e9e3039039";

    authService.changePassword(user_id, req.body)
        .then(data => res.status(200).json(data))
        .catch(error => next(error));
};

export default {
    login,
    changePassword,
    businessLogin,
}