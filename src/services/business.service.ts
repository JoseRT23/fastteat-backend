import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class BusinessService {
  // async createBusiness(data: {
  //   name: string;
  //   email?: string;
  //   mobile?: string;
  // }) {
  //   if (!data.name || data.name.trim() === "") {
  //     throw new Error("El nombre del negocio es obligatorio.");
  //   }

  //   if (data.email) {
  //     const emailExists = await prisma.business.findFirst({
  //       where: { email: data.email },
  //     });
  //     if (emailExists) throw new Error("El email ya existe.");
  //   }

  //   if (data.mobile) {
  //     const mobileExists = await prisma.business.findFirst({
  //       where: {mobile: data.mobile },
  //     });
  //     if (mobileExists) throw new Error("El número de teléfono ya existe.");
  //   }

  //   return await prisma.business.create({ data });
  // }

  async getAllBusinesses() {
    return await prisma.business.findMany({
       orderBy: {
    created_at: "desc"
  }
    });
  }

  async updateBusiness (business_id: string, data: any) {

    const business = await prisma.business.update({
      where: { business_id },
      data,
    });

    return business;
  }
}

export const businessService = new BusinessService();
