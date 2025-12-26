import { prisma } from "../config/prisma";
import { CustomError } from "../utils/errors/custom.errors";

type CreateProductParams = {
    business_id: string;
    name: string;
    description: string;
    current_price: number;
};

const createProduct = async (data: CreateProductParams) => {
    if (!data.name || data.name.trim() === "") {
        throw CustomError.badRequest("El nombre del producto es obligatorio.");
    }

    if (!data.description || data.description.trim() === "") {
        throw CustomError.badRequest("La descripcion del producto es obligatoria.");
    }

    return await prisma.product.create({ data });
};

type GetAllProductParams = {
    offset: number;
    limit: number;
    name?: string;
};

const getAllProducts = async (params: GetAllProductParams) =>{
    const where: any = {};
    if (params.name) {
        where.name = { contains: params.name, mode: "insensitive" };
    }

    const products = await prisma.product.findMany({
        where,
        skip: params.offset,    
        take: params.limit,
    });

    const total = await prisma.product.count ({ where});
    return { data: products, total };
};

type UpdateProductParams = {
    name?: string;
    description?: string;
    current_price?: number;
};

const updateProduct = async (product_id: string, data: UpdateProductParams) => {
    if (!data.name || data.name.trim() === "") {
        throw CustomError.badRequest("El nombre del producto es obligatorio.");
    }

    if (!data.description || data.description.trim() === "") {
        throw CustomError.badRequest("La descripcion del producto es obligatoria.");
    }

 const product = await prisma.product.update({
    where: {product_id},
    data,
 });
 
 return product;
}

export default {
    createProduct,
    getAllProducts,
    updateProduct,
};
