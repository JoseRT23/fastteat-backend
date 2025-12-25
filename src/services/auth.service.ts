import { bcryptAdapter } from "../config/bcrypt.adapter";
import { jwtAdapter } from "../config/jwt.adapter";
import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";

type LoginInput = {
    email: string;
    password: string;
}
const login = async(input: LoginInput) => {

    const user = await prisma.user.findUnique({
        where: {
            email: input.email
        }
    });

    if (!user) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const isPasswordValid = bcryptAdapter.compare(input.password, user.password_hash);
    if (!isPasswordValid) throw CustomError.badRequest("Usuario o contraseña incorrectos");

    const token = await jwtAdapter.generateToken({
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
    });

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

    const user = await prisma.user.findUnique({
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

export default {
    login,
    changePassword,
}