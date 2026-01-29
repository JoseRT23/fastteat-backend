import { NextFunction, Request, Response } from "express";  
import invitationService  from "../services/invitations.service";

class InvitationController {
    async validateInvitation(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const invitation = await invitationService.validateToken(token);
            return res.json(invitation);
        }   catch (error: any) {            
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
        } catch (error)    {
            next(error);
        }
}

}
export const invitationController = new InvitationController();
