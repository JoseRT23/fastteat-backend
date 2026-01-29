import { Router } from "express";
import { businessController } from "../controllers/business.controller";
import auth from "../middlewares/auth.middleware";

export const businessRoutes = () => {
  const router = Router();
  const controller = businessController;

  router.post("/", controller.createBusiness);
  router.get("/", controller.getAllBusinesses);
  router.patch("/:business_id", auth.validateJWT, controller.updateBusiness);
  router.post("/invite-user", auth.validateJWT, controller.inviteUser);

  return router;
}
