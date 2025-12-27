import { Router } from "express";
import authController from "../controllers/auth.controller";

export const authRoutes = () => {
    const router = Router();

    router.post('/login', authController.login);
    router.post('/business-login', authController.businessLogin);
    router.post('/change-password', authController.changePassword);
    router.post('/recovery-password', () => {});
    router.post('/confirm-account', () => {});

    return router;
}