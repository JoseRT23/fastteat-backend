import { Router } from "express";
import { invitationController } from "../controllers/invitations.controller";

export const invitationsRoutes = () => {
  const router = Router();

  router.get("/validate/:token", invitationController.validateInvitation);
  router.post("/accept", invitationController.acceptInvitation);
  router.post("/cancel", invitationController.cancelInvitation);

  return router;
};
