import { Router } from "express";
import ordersController from "../controllers/orders.controller";

export const orderRoutes = () => {
    const router = Router();
    const controller = ordersController;

    router.get('/', controller.getOrders);
    router.post('/', controller.createOrder);

    return router;
}