import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

const createUser = (req: Request, res: Response, next: NextFunction) => {
    userService.createUser(req.body)
        .then(user => res.status(201).json(user))
        .catch(error => next(error));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;

    userService.updateUser(user_id, req.body)
        .then(user => res.status(200).json(user))
        .catch(error => next(error));
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;

    userService.getUser(user_id)
        .then(user => res.status(200).json(user))
        .catch(error => next(error));
};

export default {
    createUser,
    updateUser,
    getUser,
}