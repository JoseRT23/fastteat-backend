import { Router } from "express";
import { orderRoutes } from "./orders.routes";
import { businessRoutes } from "./business.routes";

export const routes = () => {
    const router = Router();

    router.use('/orders', orderRoutes());
    router.use('/business', businessRoutes());

    return router;
}