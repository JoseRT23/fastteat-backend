import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service";
import { CustomError } from "../utils/errors/custom.errors";

class ProductsController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        business_id: req.user.business_id,
        ...req.body,
      };

      const product = await productService.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    // Listar productos
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.pageSize as string) || 10;
      const name = (req.query.name as string) || "";

      const params = {
        businessId: req.user.business_id,
        offset: (page - 1) * limit,
        limit,
        name,
      };

      if (params.businessId === null) {
          throw CustomError.badRequest("No tiene permisos para realizar esta acción."); 
      }

      const products = await productService.getAllProducts(params);

      return res.json({
        page,
        limit,
        total: products.total,
        totalPages: Math.ceil(products.total / limit),
        data: products.data,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    // Editar producto
    try {
      const productId = req.params.product_id;
      const data = {
        businessId: req.user.business_id,
        ...req.body,
      };

      const product = await productService.updateProduct(productId, data);

      return res.json(product);
    } catch (error: any) {
      next(error);
    }
  }
}
      export const productsController = new ProductsController();