import { prisma } from "../config/prisma"
import { CustomError } from "../utils/errors/custom.errors"

type GetOrderParams = {
  businessId: string
  orderId: string
}
const getOrder = async({
  businessId,
  orderId
}: GetOrderParams) => {
    const where = {
        business_id: businessId,
        order_id: orderId
    }

    const order = await prisma.order.findUnique({ 
        where,
        include: {
            user: {
                select: {
                    name: true
                }
            },
            items: {
                select: {
                    order_item_id: true,
                    product_id: true,
                    product_name: true,
                    unit_price: true,
                    quantity: true,
                    subtotal: true
                }
            }
        }
     });

     return order;
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}

type GetOrdersParams = {
  businessId: string
  offset: number
  limit: number
  status: OrderStatus
  sort: 'asc' | 'desc'
}
const getOrders = async ({
  businessId,
  offset,
  limit,
  status,
  sort,
}: GetOrdersParams) => {
    const where = {
        business_id: businessId,
        ...(status && { status }),
    }
    const orders = await prisma.order.findMany({
        where,
        orderBy: {
            created_at: sort
        },
        skip: offset,
        take: limit,
        include: {
            user: {
                select: {
                    name: true
                }
            },
            items: {
                select: {
                    product_name: true,
                    unit_price: true,
                    quantity: true,
                    subtotal: true
                }
            }
        }
    });

    const total = await prisma.order.count({
        where
    });

    return {
        total,
        data: orders
    }
}

type CreateOrderInput = {
  businessId: string
  userId: string
  items: {
    productId: string
    quantity: number
  }[]
}
const createOrder = async (input: CreateOrderInput) => {
    return await prisma.$transaction(async tx => {
        const products = await tx.product.findMany({
            where: {
                business_id: input.businessId,
                product_id: {
                    in: input.items.map(i => i.productId),
                },
                active: true,
            },
        });

        if (products.length !== input.items.length) {
            throw CustomError.badRequest("Producto inválido o inactivo");
        }

        const order = await tx.order.create({
            data: {
                business_id: input.businessId,
                user_id: input.userId,
                total: 0,
            },
        });

        const orderItemsData = input.items.map(item => {
            const product = products.find(p => p.product_id === item.productId)!;
            const subtotal = product.current_price.mul(item.quantity);

            return {
                order_id: order.order_id,
                product_id: product.product_id,
                product_name: product.name,
                unit_price: product.current_price,
                quantity: item.quantity,
                subtotal,
            }
        });

        await tx.orderItem.createMany({
            data: orderItemsData,
        });

        const totalResult = await tx.orderItem.aggregate({
            where: {
                order_id: order.order_id,
            },
            _sum: {
                subtotal: true,
            },
        });

        const total = totalResult._sum.subtotal ?? 0;

        const updatedOrder = await tx.order.update({
            where: { order_id: order.order_id },
            data: { total },
        });
        
        return updatedOrder;
    });
}

type UpdateOrderInput = {
  businessId: string
  orderItemId: string
  userId: string
  items: {
    productId: string
    quantity: number
  }[]
}
const updateOrder = async (orderId: string, input: UpdateOrderInput) => {
    return await prisma.$transaction(async tx => {
        const existingOrder = await tx.order.findFirst({
            where: { 
                business_id: input.businessId,
                order_id: orderId
            },
            include: {
                items: true
            }
        });

        if (!existingOrder) {
            throw CustomError.badRequest("La orden no existe");
        }

        for (const item of input.items) {
            if (item.quantity <= 0) throw CustomError.badRequest("La cantidad debe ser mayor a 0 en los items");
        }

        const products = await tx.product.findMany({
            where: {
                business_id: input.businessId,
                product_id: {
                    in: input.items.map(i => i.productId),
                },
                active: true,
            },
        });

        if (products.length !== input.items.length) {
            throw CustomError.badRequest("Producto inválido o inactivo");
        }

        const orderItemsData = input.items.map(item => {
            const product = products.find(p => p.product_id === item.productId)!;
            const subtotal = product.current_price.mul(item.quantity);

            return {
                order_id: existingOrder.order_id,
                product_id: product.product_id,
                product_name: product.name,
                unit_price: product.current_price,
                quantity: item.quantity,
                subtotal,
            }
        });

        if (orderItemsData.length === 0) {
            throw CustomError.badRequest("La orden debe tener al menos un ítem");
        }

        const itemsToDelete = existingOrder.items.filter(ei => 
            !orderItemsData.some(oi => oi.product_id === ei.product_id)
        );

        let updatedItemsCount = 0;
        for (const item of orderItemsData) {
            const existingItem = existingOrder.items.find(oi => oi.product_id === item.product_id);
            if (existingItem) {
                if (existingItem.quantity === item.quantity) continue;

                await tx.orderItem.update({
                    where: { order_item_id: existingItem.order_item_id },
                    data: {
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                        unit_price: item.unit_price
                    }
                });

                updatedItemsCount++;
            } else {
                await tx.orderItem.create({
                    data: {
                        order_id: item.order_id,
                        product_id: item.product_id,
                        product_name: item.product_name,
                        unit_price: item.unit_price,
                        quantity: item.quantity,
                        subtotal: item.subtotal
                    }
                })
            }
        }

        if (updatedItemsCount === 0 && itemsToDelete.length === 0) {
            const { items, ...data } = existingOrder;
            return data;
        }

        for (const item of itemsToDelete) {
            await tx.orderItem.delete({
                where: { 
                    order_id: item.order_id,
                    order_item_id: item.order_item_id 
                }
            });
        }

        const totalResult = await tx.orderItem.aggregate({
            where: {
                order_id: existingOrder.order_id,
            },
            _sum: {
                subtotal: true,
            },
        });

        const total = totalResult._sum.subtotal ?? 0;

        const updatedOrder = await tx.order.update({
            where: { order_id: orderId },
            data: { total: total }
        });

        return updatedOrder;
    });
}

type UpdateOrderStatusInput = {
    businessId: string,
    status: OrderStatus
}
const updateOrderStatus = async (orderId: string, input: UpdateOrderStatusInput) => {
    if (!Object.values(OrderStatus).includes(input.status)) {
        throw CustomError.badRequest("Estado de orden inválido");
    }

    const updatedOrder = await prisma.order.update({
        where: {
            business_id: input.businessId,
            order_id: orderId
        },
        data: {
            status: input.status
        }
    });

    return updatedOrder;
}

export default {
    getOrder,
    getOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
}