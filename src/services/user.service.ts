import { bcryptAdapter } from "../config/bcrypt.adapter";
import { jwtAdapter } from "../config/jwt.adapter";
import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";

type CreateUserInput = {
    name: string;
    email: string;
    phone: string;
    password: string;
}
const createUser = async(input: CreateUserInput) => {
    const existsUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: { contains: input.email } },
                { phone: { contains: input.phone } }
            ] 
        }
    });

    if (existsUser) throw CustomError.badRequest("El usuario ya se encuentra registrado");

    const password_hash = bcryptAdapter.hash(input.password);

    const newUser = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            password_hash: password_hash
        }
    });

    const token = await jwtAdapter.generateToken({
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
    });

    return {
        ...newUser,
        token,
    }
}

type UpdateUserInput = {
    name: string;
}
const updateUser = async(user_id: string, input: UpdateUserInput) => {
    await prisma.user.update({
        where: { user_id },
        data: {
            name: input.name,
        }
    });

    return {
        message: "Usuario actualizado correctamente"
    };
}

const getUser = async(user_id: string) => {
    return await prisma.user.findUnique({
        where: { user_id },
        select: {
            user_id: true,
            name: true,
            email: true,
            phone: true,
        }
    });
}

export default {
    createUser,
    updateUser,
    getUser,
}