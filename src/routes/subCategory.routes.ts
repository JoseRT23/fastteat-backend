import { Router } from "express";
import { subCategoriesController } from "../controllers/subCategory.controller";

export const subCategoryRoutes = () => {
  const router = Router();

  router.post( "/", subCategoriesController.createSubCategory);
  router.get( "/", subCategoriesController.getCategories);
  router.get( "/:category_id", subCategoriesController.getSubCategoriesByCategory);
  router.get( "/subcategory/:sub_category_id", subCategoriesController.getSubCategories);
  router.patch( "/:sub_category_id", subCategoriesController.updateSubCategory);
  router.patch( "/:sub_category_id/status", subCategoriesController.updateSubCategoryStatus);

  return router;
};