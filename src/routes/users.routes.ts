import { Router } from "express";
import userController from '../controllers/users.controller';


export const userRoutes = () => {
    const router = Router();

    router.get('/:user_id', userController.getUser);
    router.post('/', userController.createUser);
    router.patch('/:user_id', userController.updateUser);

    return router;
}