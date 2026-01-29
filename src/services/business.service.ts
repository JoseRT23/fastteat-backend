import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";
import { InvitationStatus } from "../generated/prisma/enums";
import { randomUUID } from "node:crypto";
import emailService from "./email.service";

type CreateBusinessParams = {
  name: string;
  email: string;
  mobile: string;
};
const createBusiness = async (data: CreateBusinessParams) => {
  if (!data.name || data.name.trim() === "") {
    throw CustomError.badRequest("El nombre del negocio es obligatorio.");
  }

  if (!data.email || data.email.trim() === "") {
    throw CustomError.badRequest("El email del negocio es obligatorio.");
  }

  if (!data.mobile || data.mobile.trim() === "") {
    throw CustomError.badRequest(
      "El numero de telefono del negocio es obligatorio.",
    );
  }

  if (data.email) {
    const emailExists = await prisma.business.findFirst({
      where: { email: data.email },
    });
    if (emailExists) throw CustomError.badRequest("El email ya existe.");
  }

  if (data.mobile) {
    const mobileExists = await prisma.business.findFirst({
      where: { mobile: data.mobile },
    });
    if (mobileExists)
      throw CustomError.badRequest(
        "El numero de telefono del negocio es obligatorio.",
      );
  }

  return await prisma.business.create({ data });
};

type GetAllBusinessesParams = {
  offset: number;
  limit: number;
  name?: string;
};

const getAllBusinesses = async (params: GetAllBusinessesParams) => {
  const where: any = {};
  if (params.name) {
    where.name = { contains: params.name, mode: "insensitive" };
  }

  const business = await prisma.business.findMany({
    where,
    skip: params.offset,
    take: params.limit,
    orderBy: {
      created_at: "desc",
    },
  });

  const total = await prisma.business.count({ where });
  return { data: business, total };
};

type updateBusinessParams = {
  name: string;
  mobile: string;
  email: string;
  address: string;
};

const updateBusiness = async (
  business_id: string,
  data: updateBusinessParams,
) => {
  if (!data.name || data.name.trim() === "") {
    throw CustomError.badRequest("El nombre del negocio es obligatorio.");
  }

  if (!data.mobile || data.mobile.trim() === "") {
    throw CustomError.badRequest(
      "El numero de telefono del negocio es obligatorio.",
    );
  }

  if (!data.email || data.email.trim() === "") {
    throw CustomError.badRequest("El email del negocio es obligatorio.");
  }

  if (data.mobile) {
    const mobileExists = await prisma.business.findFirst({
      where: { mobile: data.mobile },
    });
    if (mobileExists)
      throw CustomError.badRequest(
        "El numero de telefono del negocio ya existe.",
      );
  }

  if (data.email) {
    const emailExists = await prisma.business.findFirst({
      where: { email: data.email },
    });
    if (emailExists)
      throw CustomError.badRequest("El email del negocio ya existe.");
  }

  const business = await prisma.business.update({
    where: { business_id },
    data,
  });

  return business;
};

enum UserRole {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  STAFF = "STAFF",
}

type InviteUserParams = {
  businessId: string | null;
  email: string;
  role: UserRole;
};

const inviteUser = async (data: InviteUserParams) => {
  const { businessId, email, role } = data;

  if (!businessId) {
    throw CustomError.badRequest(
      "El negocio es obligatorio para invitar usuarios.",
    );
  }

  if (!email || email.trim() === "") {
    throw CustomError.badRequest(
      "El email es obligatorio para invitar usuarios.",
    );
  }

  if (!role) {
    throw CustomError.badRequest(
      "El rol es obligatorio para invitar usuarios.",
    );
  }

  const businessExists = await prisma.business.findFirst({
    where: { business_id: businessId },
  });

  if (!businessExists) {
    throw CustomError.badRequest("El negocio no existe.");
  }

  const invitationExists = await prisma.businessInvitations.findFirst({
    where: {
      email,
      business_id: businessId,
      status: InvitationStatus.PENDING,
    },
  });

  if (invitationExists) {
    throw CustomError.badRequest(
      "Ya existe una invitación pendiente para este email",
    );
  }

  const userExists = await prisma.user.findFirst({
    where: { email },
  });

  if (userExists) {
    const alreadyInBusiness = await prisma.businessUser.findFirst({
      where: {
        user_id: userExists.user_id,
        business_id: businessId,
      },
    });

    if (alreadyInBusiness) {
      throw CustomError.badRequest("El usuario ya pertenece a este negocio.");
    }
  }

  const token = randomUUID();

  await prisma.businessInvitations.create({
    data: {
      business_id: businessId,
      email,
      role,
      token,
      status: InvitationStatus.PENDING,
      expired_at: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
  });

  const inviteUrl = `${process.env.FRONTEND_URL}/invitations/accept?token=${token}`;

  await emailService.sendInvitationEmail(
    email,
    userExists?.name ?? "",
    businessExists?.name,
    inviteUrl,
  );

  return {
    message: "Invitacion enviada correctamente.",
  };
};

export default {
  createBusiness,
  getAllBusinesses,
  updateBusiness,
  inviteUser,
};
