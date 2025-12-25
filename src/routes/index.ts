import { Router } from "express";
import { orderRoutes } from "./orders.routes";
import { businessRoutes } from "./business.routes";
import { userRoutes } from "./users.routes";
import { authRoutes } from "./auth.routes";

export const routes = () => {
    const router = Router();

    router.use('/auth', authRoutes());
    router.use('/orders', orderRoutes());
    router.use('/business', businessRoutes());
    router.use('/users', userRoutes());

    return router;
}