import { bcryptAdapter } from "../config/bcrypt.adapter";
import { jwtAdapter } from "../config/jwt.adapter";
import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";

type LoginInput = {
    email: string;
    password: string;
}
const login = async(input: LoginInput) => {

    const user = await prisma.user.findFirst({
        where: {
            email: input.email
        }
    });

    if (!user) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const isPasswordValid = bcryptAdapter.compare(input.password, user.password_hash);
    if (!isPasswordValid) throw CustomError.badRequest("Usuario o contraseña incorrectos");
    
    const token = await jwtAdapter.generateToken({
        user_id: user.user_id,
    });

    return token;
}

type BusinessLoginInput = {
    email: string;
    password: string;
    business_id?: string;
}

type BusinessSelectionRequired = {
    multipleBusinesses: true;
    businesses: Array<{ business_id: string; business_name: string }>;
}

const businessLogin = async(input: BusinessLoginInput) => {

    const user = await prisma.user.findFirst({
        where: {
            email: input.email
        }
    });

    if (!user) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const isPasswordValid = bcryptAdapter.compare(input.password, user.password_hash);
    if (!isPasswordValid) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const memberships = await prisma.businessUser.findMany({
        where: {
            user_id: user.user_id
        },
        include: {
            business: true
        }
    });    
    
    if (memberships.length === 0) throw CustomError.badRequest("El usuario no pertenece a ningún negocio");

    if (!input.business_id && memberships.length > 1) {
        const result: BusinessSelectionRequired = {
            multipleBusinesses: true,
            businesses: memberships.map(({ business }) => ({
                business_id: business.business_id,
                business_name: business.name,
            })),
        };
        return result;
    }

    const membership = input.business_id
        ? memberships.find(({ business_id }) => business_id === input.business_id)
        : memberships[0];

    if (!membership) throw CustomError.forbidden("No tienes acceso a este negocio");

    const token = await jwtAdapter.generateToken({
        user_id: user.user_id,
        business_id: membership.business_id,
    });

    if (!token) throw CustomError.internalServer("No se pudo generar el token de acceso");

    return token;
}

type ChangePasswordInput = {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
const changePassword = async(user_id: string, input: ChangePasswordInput) => {
    if (input.newPassword === input.currentPassword) {
        throw CustomError.badRequest("La nueva contraseña es igual a la actual");
    }

    if (input.newPassword !== input.confirmNewPassword) {
        throw CustomError.badRequest("Las contraseñas no coinciden");
    }

    const user = await prisma.user.findFirst({
        where: {
            email: input.email
        }
    });

    if (!user) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const isPasswordValid = bcryptAdapter.compare(input.currentPassword, user.password_hash);
    if (!isPasswordValid) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const newPasswordHash = bcryptAdapter.hash(input.newPassword);
    await prisma.user.update({
        where: {
            user_id: user_id
        },
        data: {
            password_hash: newPasswordHash
        }
    });

    return { message: "Contraseña actualizada correctamente" };
}

const me = async(user_id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_id
        },
        select: {
            user_id: true,
            name: true,
            email: true, 
        }
    });

    if (!user) throw CustomError.notFound("Usuario no encontrado");

    return user;
}

export default {
    login,
    businessLogin,
    changePassword,
    me,
}