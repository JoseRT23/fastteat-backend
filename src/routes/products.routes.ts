import { Router } from 'express';
import { productsController } from '../controllers/products.controller';

export const productRoutes = () => {
    const router = Router();
    const controller = productsController;

    router.post("/", controller.createProduct);
    router.get("/", controller.getAllProducts);
    router.patch("/:product_id", controller.updateProduct);

    return router;
}