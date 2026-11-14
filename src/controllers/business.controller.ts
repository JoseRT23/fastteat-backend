import { NextFunction, Request, Response } from "express";
import businessService from "../services/business.service";
import { CustomError } from "../utils/errors/custom.errors";
import { UserRole } from "../generated/prisma";

class BusinessController {
  async registerBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await businessService.registerBusiness(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async checkUserEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await businessService.checkUserEmail(req.query.email as string);
      return res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async createBusiness(req: Request, res: Response, next: NextFunction) {
    // Crear negocio
    try {
      const business = await businessService.createBusiness(req.body);
      return res.status(201).json(business);
    } catch (error: any) {
      next(error);
    }
  }

  async getAllBusinesses(req: Request, res: Response, next: NextFunction) {
    // Listar negocios
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.pageSize as string) || 10;
      const name = (req.query.name as string) || "";

      const params = {
        offset: (page - 1) * limit,
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

  async updateBusiness(req: Request, res: Response, next: NextFunction) {
    // Editar negocio
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
        role,
      });

      return res.status(201).json({
        message: " Invitacion enviada correctamente",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getBusinessById(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.business_id;

      const business = await businessService.getBusinessById(businessId);

      return res.json(business);
    } catch (error) {
      next(error);
    }
  }

  async deleteBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.business_id;

      await businessService.deleteBusiness(businessId);

      return res.json({
        message: "Negocio eliminado correctamente.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getBusinessUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.user.business_id;

      if (!businessId) {
        throw CustomError.badRequest("El id del negocio es requerido");
      }

      const users = await businessService.getBusinessUsers(businessId);
      return res.status(200).json(users);
    } catch (error: any) {
      next(error);
    }
  }

  async updateBusinessUserRole(req: Request, res: Response, next: NextFunction) {
    const businessUserId = req.params.business_user_id;
    const role = req.body?.role;

    if (!businessUserId) {
      throw CustomError.badRequest("El id del usuario de negocio es requerido");
    }

    if (!role) {
      throw CustomError.badRequest(`Debe elegir un rol ${Object.values(UserRole)}`);
    }

    await businessService.updateBusinessUserRole(businessUserId, role);
    return res.status(200).json({message: "Rol actualizado"});
  }
}

export const businessController = new BusinessController();
