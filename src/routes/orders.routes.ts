import { Router } from "express";
import ordersController from "../controllers/orders.controller";
import auth from "../middlewares/auth.middleware";

export const orderRoutes = () => {
    const router = Router();
    const controller = ordersController;

    router.use([ auth.validateJWT ]);

    router.get('/', controller.getOrders);
    router.get('/:order_id', controller.getOrder);
    router.post('/', controller.createOrder);
    router.patch('/:order_id/status', controller.updateOrderStatus);
    router.patch('/:order_id', controller.updateOrder);

    return router;
}