import { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service";

const getOrders = (req: Request, res: Response, next: NextFunction) => {
    orderService.getOrders()
    .then(orders => res.json(orders))
    .catch(error => next(error));
};

const createOrder = (req: Request, res: Response) => {

};

export default {
    getOrders,
    createOrder,
}