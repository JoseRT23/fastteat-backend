import { Router } from 'express';
import { productsController } from '../controllers/products.controller';
import auth from "../middlewares/auth.middleware";

export const productRoutes = () => {
    const router = Router();
    const controller = productsController;

    router.use([ auth.validateJWT ]);

    router.post("/", controller.createProduct);
    router.get("/", controller.getAllProducts);
    router.patch("/:product_id", controller.updateProduct);

    return router;
}