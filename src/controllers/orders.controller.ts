import { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service";


const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const businessId = "96bbaf82-1453-4e2d-a9f0-0de5552951c5";
    const orderId = req.params.order_id;

    const params = {
        businessId,
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
    const businessId = "96bbaf82-1453-4e2d-a9f0-0de5552951c5";

    const params = {
        businessId,
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
    orderService.createOrder(req.body)
        .then(order => res.status(201).json(order))
        .catch(error => next(error));
};

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.order_id;
    // const params = {
    //     businessId: "96bbaf82-1453-4e2d-a9f0-0de5552951c5",
    //     status: req.body.status as OrderStatus
    // }

    orderService.updateOrder(orderId, req.body)
        .then(order => res.status(200).json(order))
        .catch(error => next(error));
};

const updateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.order_id;

    const params = {
        businessId: "96bbaf82-1453-4e2d-a9f0-0de5552951c5",
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