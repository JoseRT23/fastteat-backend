import { Router } from "express";
import { invitationController } from "../controllers/invitations.controller";
import auth from "../middlewares/auth.middleware";

export const invitationsRoutes = () => {
  const router = Router();

  router.get("/", auth.validateJWT, invitationController.getAllInvitations);
  router.get("/validate/:token", invitationController.validateInvitation);
  router.post("/accept", invitationController.acceptInvitation);
  router.post("/decline", invitationController.cancelInvitation);
  router.delete("/:id", invitationController.deleteInvitation);

  return router;
};
