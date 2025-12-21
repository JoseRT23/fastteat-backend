import { Request, Response } from "express";
import { businessService } from "../services/business.service";


class BusinessController {
  // async createBusiness(req: Request, res: Response) { // Crear negocio
  //   try {
  //     const business = await businessService.createBusiness(req.body);
  //     return res.status(201).json(business);
  //   } catch (error: any) {
  //     return res.status(400).json({ message: error.message });
  //   }
  // }

 
  async getAllBusinesses(req: Request, res: Response) {  // Obtener todos los negocios
    try {
      const businesses = await businessService.getAllBusinesses();
      return res.json(businesses);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateBusiness(req: Request, res: Response) { // Editar negocio
    try {
      const businessId = req.params.business_id;
      const data = req.body;

      const business = await businessService.updateBusiness(businessId, data);
      
      return res.json(business);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
}

}
export const businessController = new BusinessController();
