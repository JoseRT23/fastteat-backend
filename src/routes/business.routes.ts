import { Router } from "express";
import { businessController } from "../controllers/business.controller";
import auth from "../middlewares/auth.middleware";

export const businessRoutes = () => {
  const router = Router();
  const controller = businessController;

  router.get("/check-user", controller.checkUserEmail);
  router.post("/register", controller.registerBusiness);
  router.post("/invite-user", auth.validateJWT, controller.inviteUser);
  
  router.get("/users", auth.validateJWT, controller.getBusinessUsers)
  router.patch("/users/:business_user_id", auth.validateJWT, controller.updateBusinessUserRole);

  router.route("/")
    .get(controller.getAllBusinesses)
    .post(controller.createBusiness);

  router.route("/:business_id")
    .get(controller.getBusinessById)
    .patch(auth.validateJWT, controller.updateBusiness)
    .delete(auth.validateJWT, controller.deleteBusiness);

  return router;
};
