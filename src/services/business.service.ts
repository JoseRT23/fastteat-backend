import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";
import { InvitationStatus } from "../generated/prisma/enums";
import { randomUUID } from "node:crypto";
import emailService from "./email.service";
import { bcryptAdapter } from "../config/bcrypt.adapter";

type RegisterBusinessParams = {
  user: {
    name?: string;
    email: string;
    phone?: string;
    password?: string;
  };
  business: {
    name: string;
    email: string;
    mobile: string;
    address?: string;
  };
};

const registerBusiness = async (data: RegisterBusinessParams) => {
  const email = data.user?.email?.trim().toLowerCase();

  if (!email) {
    throw CustomError.badRequest("El email del usuario es obligatorio.");
  }

  if (!data.business?.name?.trim() || !data.business?.email?.trim() || !data.business?.mobile?.trim()) {
    throw CustomError.badRequest("El nombre, email y telefono del negocio son obligatorios.");
  }

  return prisma.$transaction(async (tx) => {
    let user = await tx.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: data.user?.phone?.trim() }
        ]
      }
    });

    if (user && (user.email === email || user.phone === data.user?.phone?.trim())) {
      throw CustomError.badRequest("El email o telefono del usuario ya estan en uso.");
    }

    const userHasBusiness = user ? await tx.businessUser.findFirst({ where: {
      AND: [
        { user_id: user.user_id },
        { role: "OWNER" }
      ]
    } }) : null;

    if (userHasBusiness) {
      throw CustomError.badRequest("El usuario ya tiene un negocio asociado.");
    }

    const businessExists = await tx.business.findFirst({
      where: { 
        OR: [
          { email: data.business.email.trim().toLowerCase() },
          { mobile: data.business.mobile.trim() },
          { name: data.business.name.trim() }
        ]
      }
    });

    if (businessExists) {
      throw CustomError.badRequest("El email, telefono o nombre del negocio ya estan en uso.");
    }

    if (!user) {
      if (!data.user.name?.trim() || !data.user.phone?.trim() || !data.user.password) {
        throw CustomError.badRequest("Para un usuario nuevo debes indicar nombre, telefono y contraseña.");
      }

      user = await tx.user.create({
        data: {
          name: data.user.name.trim(),
          email,
          phone: data.user.phone.trim(),
          password_hash: bcryptAdapter.hash(data.user.password),
        },
      });
    }

    const business = await tx.business.create({
      data: {
        name: data.business.name.trim(),
        email: data.business.email.trim().toLowerCase(),
        mobile: data.business.mobile.trim(),
        address: data.business.address?.trim() || null,
      },
    });

    await tx.businessUser.create({
      data: {
        business_id: business.business_id,
        user_id: user.user_id,
        role: UserRole.OWNER,
      },
    });

    return { business, user_id: user.user_id };
  });
};

const checkUserEmail = async (email: string) => {
  if (!email?.trim()) {
    throw CustomError.badRequest("El email es obligatorio.");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { user_id: true },
  });

  return { exists: Boolean(user) };
};

type CreateBusinessParams = {
  name: string;
  email: string;
  mobile: string;
  latitude?: string;
  longitude?: string;
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

const getBusinessById = async (business_id: string) => {
  const business = await prisma.business.findFirst({
    where: {
      business_id,
      active: true,
    },
  });

  if (!business) {
    throw CustomError.notFound("Negocio no encontrado.");
  }

  return business;
};

const deleteBusiness = async (business_id: string) => {
  const business = await prisma.business.findFirst({
    where: {
      business_id,
      active: true,
    },
  });

  if (!business) {
    throw CustomError.notFound("Negocio no encontrado.");
  }

  return await prisma.business.update({
    where: {
      business_id,
    },
    data: {
      active: false,
    },
  });
};

export default {
  registerBusiness,
  checkUserEmail,
  createBusiness,
  getAllBusinesses,
  updateBusiness,
  inviteUser,
  getBusinessById,
  deleteBusiness,
};
