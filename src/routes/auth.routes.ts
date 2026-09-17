import { Router } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

export const authRoutes = () => {
    const router = Router();

    router.post('/login', authController.login);
    router.post('/business-login', authController.businessLogin);
    router.post('/change-password', authController.changePassword);
    router.post('/recovery-password', () => {});
    router.post('/confirm-account', () => {});
    router.get('/me', authMiddleware.validateJWT, authController.me);
    return router;
}