import { NextFunction, Request, Response } from "express";
import subCategoryService from "../services/subCategory.service";

class SubCategoriesController {
  async createSubCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategory =
        await subCategoryService.createSubCategory(req.body);

      return res.status(201).json(subCategory);
    } catch (error) {
      next(error);
    }
  }

  async getAllSubCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategories =
        await subCategoryService.getAllSubCategories();

      return res.json(subCategories);
    } catch (error) {
      next(error);
    }
  }

  async getSubCategoriesByCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categoryId = req.params.category_id;

      const subCategories =
        await subCategoryService.getSubCategoriesByCategory(
          categoryId,
        );

      return res.json(subCategories);
    } catch (error) {
      next(error);
    }
  }

  async getSubCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategoryId = req.params.sub_category_id;

      const subCategory =
        await subCategoryService.getSubCategoryById(
          subCategoryId,
        );

      return res.json(subCategory);
    } catch (error) {
      next(error);
    }
  }

  async updateSubCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategoryId = req.params.sub_category_id;

      const subCategory =
        await subCategoryService.updateSubCategory(
          subCategoryId,
          req.body,
        );

      return res.json(subCategory);
    } catch (error) {
      next(error);
    }
  }

  async updateSubCategoryStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategoryId = req.params.sub_category_id;
      const { active } = req.body;

      const subCategory =
        await subCategoryService.updateSubCategoryStatus(
          subCategoryId,
          active,
        );

      return res.json(subCategory);
    } catch (error) {
      next(error);
    }
  }
}

export const subCategoriesController =
  new SubCategoriesController();