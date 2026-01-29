import { prisma } from './../config/prisma';
import { CustomError } from '../utils/errors/custom.errors';
import { InvitationStatus } from '../generated/prisma/enums';

const validateToken = async (token: string) => {
    if (!token) {
        throw CustomError.badRequest("El token invalido.");
    }

    const invitation = await prisma.businessInvitations.findFirst({
        where: {
            token,
            status: InvitationStatus.PENDING,
            expired_at: { gt: new Date() },
        },
        include: {
            business: true,
        },
    }); 

    if (!invitation) {
        throw CustomError.notFound("Invitacion no encontrada o invalida.");
    }

    const userExists = await prisma.user.findFirst({
      where: { email: invitation.email },
    });

    return {
        userExists: userExists ? true : false,
        business: invitation.business.name,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expired_at,
    };
}   

const acceptInvitation = async (
    token: string) => {
    if (!token) throw CustomError.badRequest("Token requerido");

    const invitation = await prisma.businessInvitations.findFirst({
        where: {
            token,
            status: InvitationStatus.PENDING,
            expired_at: { gt: new Date() },
        },
    });

    if (!invitation) {
        throw CustomError.badRequest("Invitacion invalida o expirada.");
    }

    const user = await prisma.user.findUnique({
        where: { 
            email: invitation.email 
        },
    });

    const alreadyInBusiness = await prisma.businessUser.findFirst({
        where: {
            user_id: user?.user_id,
            business_id: invitation.business_id,
        }
    });

    if (alreadyInBusiness) {
        throw CustomError.badRequest("El usuario ya es parte del negocio.");
    }       

    await prisma.businessUser.create({
        data: { 
            user_id: user?.user_id!,
            business_id: invitation.business_id,
            role: invitation.role,
        },  
    });

    await prisma.businessInvitations.update({
        where: { 
            business_invitation_id: invitation.business_invitation_id 
        },
        data: { 
            status: InvitationStatus.ACCEPTED 
        }
    });

    return {
        message: "Invitacion aceptada correctamente.",
    };
}   

const cancelInvitation = async (token: string) => {
  if (!token) {
    throw CustomError.badRequest("Token requerido.");
  }

  const invitation = await prisma.businessInvitations.findFirst({
    where: {
      token,
      status: InvitationStatus.PENDING,
      expired_at: { gt: new Date() }, 
    },
  });

  if (!invitation) {
    throw CustomError.notFound("Invitacion invalida o expirada");
  }

  await prisma.businessInvitations.update({
    where: { 
        business_invitation_id: 
        invitation.business_invitation_id  
    },
    data: { 
        status: InvitationStatus.CANCELLED
    },
  });

  return { message: "Invitación cancelada correctamente." };
};

export default {
    validateToken,
    acceptInvitation,
    cancelInvitation
};