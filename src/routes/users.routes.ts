import { Router } from "express";
import userController from '../controllers/users.controller';
import auth from "../middlewares/auth.middleware";


export const userRoutes = () => {
    const router = Router();

    router.use([ auth.validateJWT ]);

    router.get('/:user_id', userController.getUser);
    // router.post('/hook', userController.hook);
    router.post('/', userController.createUser);
    router.patch('/:user_id', userController.updateUser);

    return router;
}