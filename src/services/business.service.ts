import { prisma } from "../config/prisma"
import { CustomError } from "../utils/errors/custom.errors";

  type CreateBusinessParams = {
    name: string;
    email: string;
    mobile: string;
  };
  const createBusiness = async(data: CreateBusinessParams) => {
    if (!data.name || data.name.trim() === "") {
      throw CustomError.badRequest("El nombre del negocio es obligatorio.");
    }

    if (!data.email || data.email.trim() === "") {
      throw CustomError.badRequest("El email del negocio es obligatorio.");
    }

    if (!data.mobile || data.mobile.trim() === "") {
      throw CustomError.badRequest("El numero de telefono del negocio es obligatorio.");
    }

    if (data.email) {
      const emailExists = await prisma.business.findFirst({
        where: { email: data.email },
      });
      if (emailExists) throw CustomError.badRequest("El email ya existe.");
    }

    if (data.mobile) {
      const mobileExists = await prisma.business.findFirst({
        where: {mobile: data.mobile },
      });
      if (mobileExists) throw CustomError.badRequest("El numero de telefono del negocio es obligatorio.");
    }

    return await prisma.business.create({ data });
  }

  type GetAllBusinessesParams = {
    offset: number;
    limit: number;
    name?: string;
  };

  const getAllBusinesses = async (params: GetAllBusinessesParams) => {
    const where: any = {};
    if (params.name) {
      where.name = {contains: params.name, mode: "insensitive"};
    }

    const business = await prisma.business.findMany({
      where,
      skip: params.offset,
      take: params.limit,
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.business.count({where});
    return { data: business, total};
  };

  type updateBusinessParams = {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };

  const updateBusiness = async (business_id: string, data: updateBusinessParams) => {

    if (!data.name || data.name.trim() === "") {
      throw CustomError.badRequest("El nombre del negocio es obligatorio.");
    }

    if (!data.mobile || data.mobile.trim() === "") {
      throw CustomError.badRequest("El numero de telefono del negocio es obligatorio.");
    }

    if (!data.email || data.email.trim() === "") {
      throw CustomError.badRequest("El email del negocio es obligatorio.");
    }

    if (data.mobile) {
      const mobileExists = await prisma.business.findFirst({
        where: {mobile: data.mobile },
      });
      if (mobileExists) throw CustomError.badRequest("El numero de telefono del negocio ya existe.");
    }

    if (data.email) {
      const emailExists = await prisma.business.findFirst({
        where: { email: data.email },
      });
      if (emailExists) throw CustomError.badRequest("El email del negocio ya existe.");
    }

    const business = await prisma.business.update({
    
      where: { business_id },
      data,
    });

    return business;
  }


export default {
    createBusiness,
    getAllBusinesses,
    updateBusiness  
};
