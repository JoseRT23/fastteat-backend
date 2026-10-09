import { prisma } from "../config/prisma";

import { CustomError } from "../utils/errors/custom.errors";

type CreateSubCategoryParams = {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
};

const createSubCategory = async (data: CreateSubCategoryParams) => {
  if (!data.category_id || data.category_id.trim() === "") {
    throw CustomError.badRequest(
      "La categoría de la subcategoría es obligatoria.",
    );
  }

  if (!data.name || data.name.trim() === "") {
    throw CustomError.badRequest(
      "El nombre de la subcategoría es obligatorio.",
    );
  }

  if (!data.slug || data.slug.trim() === "") {
    throw CustomError.badRequest(
      "El slug de la subcategoría es obligatorio.",
    );
  }

  // Verificar que la categoría exista
  const category = await prisma.category.findFirst({
    where: {
      category_id: data.category_id,
      active: true,
    },
  });

  if (!category) {
    throw CustomError.notFound(
      "La categoría no existe o está inactiva.",
    );
  }

  // Evitar subcategorías duplicadas dentro de la misma categoría
  const existingSubCategory = await prisma.subCategory.findFirst({
    where: {
      category_id: data.category_id,
      name: data.name,
    },
  });

  if (existingSubCategory) {
    throw CustomError.badRequest(
      "Ya existe una subcategoría con ese nombre en esta categoría.",
    );
  }

  const subCategory = await prisma.subCategory.create({
    data: {
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      order: data.order ?? 0,
    },
  });

  return subCategory;
};

const getAllSubCategories = async () => {
  const subCategories = await prisma.subCategory.findMany({
    where: {
      active: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return subCategories;
};

const getSubCategoriesByCategory = async (category_id: string) => {
  if (!category_id || category_id.trim() === "") {
    throw CustomError.badRequest(
      "El identificador de la categoría es obligatorio.",
    );
  }

  const subCategories = await prisma.subCategory.findMany({
    where: {
      category_id,
      active: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return subCategories;
};

const getSubCategoryById = async (sub_category_id: string) => {
  if (!sub_category_id || sub_category_id.trim() === "") {
    throw CustomError.badRequest(
      "El identificador de la subcategoría es obligatorio.",
    );
  }

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      sub_category_id,
      active: true,
    },
  });

  if (!subCategory) {
    throw CustomError.notFound(
      "Subcategoría no encontrada.",
    );
  }

  return subCategory;
};

type UpdateSubCategoryParams = {
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
};

const updateSubCategory = async (
  sub_category_id: string,
  data: UpdateSubCategoryParams,
) => {
  if (!sub_category_id || sub_category_id.trim() === "") {
    throw CustomError.badRequest(
      "El identificador de la subcategoría es obligatorio.",
    );
  }

  if (!data.category_id || data.category_id.trim() === "") {
    throw CustomError.badRequest(
      "La categoría de la subcategoría es obligatoria.",
    );
  }

  if (!data.name || data.name.trim() === "") {
    throw CustomError.badRequest(
      "El nombre de la subcategoría es obligatorio.",
    );
  }

  if (!data.slug || data.slug.trim() === "") {
    throw CustomError.badRequest(
      "El slug de la subcategoría es obligatorio.",
    );
  }

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      sub_category_id,
      active: true,
    },
  });

  if (!subCategory) {
    throw CustomError.notFound(
      "Subcategoría no encontrada.",
    );
  }

  const category = await prisma.category.findFirst({
    where: {
      category_id: data.category_id,
      active: true,
    },
  });

  if (!category) {
    throw CustomError.notFound(
      "La categoría no existe o está inactiva.",
    );
  }

  const duplicatedSubCategory =
    await prisma.subCategory.findFirst({
      where: {
        category_id: data.category_id,
        name: data.name,
        sub_category_id: {
          not: sub_category_id,
        },
      },
    });

  if (duplicatedSubCategory) {
    throw CustomError.badRequest(
      "Ya existe una subcategoría con ese nombre en esta categoría.",
    );
  }

  const updatedSubCategory =
    await prisma.subCategory.update({
      where: {
        sub_category_id,
      },
      data: {
        category_id: data.category_id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        order: data.order ?? 0,
      },
    });

  return updatedSubCategory;
};

const updateSubCategoryStatus = async (
  sub_category_id: string,
  active: boolean,
) => {
  if (!sub_category_id || sub_category_id.trim() === "") {
    throw CustomError.badRequest(
      "El identificador de la subcategoría es obligatorio.",
    );
  }

  const subCategory = await prisma.subCategory.findUnique({
    where: {
      sub_category_id,
    },
  });

  if (!subCategory) {
    throw CustomError.notFound(
      "Subcategoría no encontrada.",
    );
  }

  const updatedSubCategory =
    await prisma.subCategory.update({
      where: {
        sub_category_id,
      },
      data: {
        active,
      },
    });

  return updatedSubCategory;
};

export default {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  updateSubCategory,
  updateSubCategoryStatus,
};