import { Router } from "express";
import { subCategoriesController } from "../controllers/subCategory.controller";

export const subCategoryRoutes = () => {
  const router = Router();

  router.post( "/", subCategoriesController.createSubCategory);
  router.get( "/", subCategoriesController.getAllSubCategories);
  router.get( "/category/:category_id", subCategoriesController.getSubCategoriesByCategory);
  router.get( "/:sub_category_id", subCategoriesController.getSubCategoryById);
  router.patch( "/:sub_category_id", subCategoriesController.updateSubCategory);
  router.patch( "/:sub_category_id/status", subCategoriesController.updateSubCategoryStatus);

  return router;
};