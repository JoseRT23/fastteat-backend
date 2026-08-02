import { NextFunction, Request, Response } from "express";
import invitationService from "../services/invitations.service";

class InvitationController {
  async validateInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const invitation = await invitationService.validateToken(token);
      return res.json(invitation);
    } catch (error: any) {
      next(error);
    }
  }

  async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await invitationService.acceptInvitation(token);
      return res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async cancelInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await invitationService.cancelInvitation(token);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllInvitations(req: Request, res: Response, next: NextFunction) {
    try {
      const invitations = await invitationService.getAllInvitations();

      return res.json(invitations);
    } catch (error) {
      next(error);
    }
  }

  async deleteInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const invitationId = req.params.id;

      await invitationService.deleteInvitation(invitationId);

      return res.json({
        message: "Invitación cancelada correctamente.",
      });
    } catch (error) {
      next(error);
    }
  }
}
export const invitationController = new InvitationController();
