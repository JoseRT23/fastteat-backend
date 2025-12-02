import { prisma } from "../config/prisma"

const getOrders = async () => {
    const orders = prisma.order.findMany();
    return orders;
}

export default {
    getOrders,
}