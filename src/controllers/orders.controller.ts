import { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service";


const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.order_id;

    const params = {
        businessId: req.user.business_id as string,
        userId: req.user.user_id as string,
        orderId
    };

    orderService.getOrder(params)
        .then(order => res.status(200).json(order))
        .catch(error => next(error));
};

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}
const getOrders = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.pageSize as string) || 10;
    const status = (req.query.status as OrderStatus) || 'PENDING';
    const sort = (req.query.sort as 'asc' | 'desc') || 'desc';

    const params = {
        businessId: req.user.business_id as string,
        userId: req.user.user_id as string,
        offset: (page - 1) * limit,
        limit: limit,
        status,
        sort
    };

    orderService.getOrders(params)
        .then(orders => res.json({
            page: page,
            limit: limit,
            total: orders.total,
            totalPages: Math.ceil(orders.total / limit),
            data: orders.data
        }))
        .catch(error => next(error));
};

const createOrder = (req: Request, res: Response, next: NextFunction) => {
    const order = {
        userId: req.user.user_id,
        ...req.body 
    };

    orderService.createOrder(order)
        .then(order => res.status(201).json(order))
        .catch(error => next(error));
};

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.order_id;
    const order = {
        userId: req.user.user_id,
        ...req.body 
    };

    orderService.updateOrder(orderId, order)
        .then(order => res.status(200).json(order))
        .catch(error => next(error));
};

const updateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.order_id;

    const params = {
        userId: req.user.user_id as string,
        status: req.body.status as OrderStatus
    }

    orderService.updateOrderStatus(orderId, params)
        .then(order => res.status(200).json(order))
        .catch(error => next(error));
};

export default {
    getOrder,
    getOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
}