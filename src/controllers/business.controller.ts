import { NextFunction, Request, Response } from "express";
import businessService from "../services/business.service";

class BusinessController {
  async createBusiness(req: Request, res: Response, next: NextFunction) { // Crear negocio
    try {
      const business = await businessService.createBusiness(req.body);
      return res.status(201).json(business);
    } catch (error: any) {
      next(error);
    }
  }

  async  getAllBusinesses (req: Request, res: Response, next: NextFunction) { // Listar negocios
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.pageSize as string) || 10;
        const name = (req.query.name as string) || '';

        const params = {
          offset: (page -1) * limit,
          limit,
          name,
        }; 

      const businesses = await businessService.getAllBusinesses(params);
    
      return res.json({
        page,
        limit,
        total: businesses.total,
        totalPages: Math.ceil(businesses.total / limit),
        data: businesses.data,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateBusiness(req: Request, res: Response, next: NextFunction) { // Editar negocio
    try {
      const businessId = req.params.business_id;
      const data = req.body;

      const business = await businessService.updateBusiness(businessId, data);
      
      return res.json(business);
    } catch (error: any) {
      next(error);
    }
}

  async inviteUser(req: Request, res: Response, next: NextFunction) { 
    try {
      const businessId = req.user.business_id;
      const { email, role } = req.body;

      const result = await businessService.inviteUser({
        businessId, 
        email, 
        role
      });
  
      return res.status(201).json({
        message:" Invitacion enviada correctamente"
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const businessController = new BusinessController();
