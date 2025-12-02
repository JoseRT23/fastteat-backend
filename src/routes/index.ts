import { Router } from "express";
import { orderRoutes } from "./orders.routes";

export const routes = () => {
    const router = Router();

    router.use('/orders', orderRoutes());

    return router;
}