import { Router } from "express";


export const orderRoutes = () => {
    const router = Router();

    router.post('/login', () => {});
    router.post('/register', () => {});
    router.post('/change-password', () => {});
    router.post('/recovery-password', () => {});
    router.post('/confirm-account', () => {});

    return router;
}