import { Router } from "express";
import { businessController } from "../controllers/business.controller";

export const businessRoutes = () => {
  const router = Router();
  const controller = businessController;

  router.post("/", controller.createBusiness);
  router.get("/", controller.getAllBusinesses);
  router.patch("/:business_id", controller.updateBusiness);

  return router;
}
