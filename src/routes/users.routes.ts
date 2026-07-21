import { Router } from "express";
import userController from '../controllers/users.controller';
import auth from "../middlewares/auth.middleware";


export const userRoutes = () => {
    const router = Router();

    router.get('/:user_id', auth.validateJWT, userController.getUser);
    router.post('/', userController.createUser);
    router.post('/create-from-invite', userController.createUserFromInvitation);
    router.patch('/:user_id', auth.validateJWT, userController.updateUser);
    // router.post('/hook', userController.hook);

    return router;
}