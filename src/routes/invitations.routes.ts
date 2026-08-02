import { Router } from "express";
import { invitationController } from "../controllers/invitations.controller";

export const invitationsRoutes = () => {
  const router = Router();

  router.get("/", invitationController.getAllInvitations);
  router.get("/validate/:token", invitationController.validateInvitation);
  router.post("/accept", invitationController.acceptInvitation);
  router.post("/decline", invitationController.cancelInvitation);
  router.delete("/:id", invitationController.deleteInvitation);

  return router;
};
