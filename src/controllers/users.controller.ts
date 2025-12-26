import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

const createUser = (req: Request, res: Response, next: NextFunction) => {
    userService.createUser(req.body)
        .then(user => res.status(201).json(user))
        .catch(error => next(error));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;

    userService.updateUser(user_id, req.body)
        .then(user => res.status(200).json(user))
        .catch(error => next(error));
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;

    userService.getUser(user_id)
        .then(user => res.status(200).json(user))
        .catch(error => next(error));
};

// const hook = (req: Request, res: Response, next: NextFunction) => {
//     const { from, data } = req.body;
//     const validSources = ['BANCO_DAVIVIENDA@davivienda.com'];
//     const senderEmail = from.split("From:")[1].trim();

//     if (!validSources.includes(senderEmail)) {
//         return res.status(400).json({ message: 'Fuente no válida' });
//     }

//     const dataParsed = data.split('\n').map((line: string) => line.trim()).filter(Boolean);
//     const transactionSite = dataParsed.find((line: string) => line.startsWith('Lugar de Transacción:'));
//     const transactionType = dataParsed.find((line: string) => line.startsWith('Clase de Movimiento:'));
//     const transactionValue = dataParsed.find((line: string) => line.startsWith('Valor Transacción:'));
//     const transactionDate = dataParsed.find((line: string) => line.startsWith('Fecha:'));
//     const transactionTime = dataParsed.find((line: string) => line.startsWith('Hora:'));

//     const response = {
//         type: transactionType.split(":")[1].trim(),
//         amount: transactionValue.split(":")[1].trim().slice(1).replace(/\./g, '').replace(',', '.'),
//         date: transactionDate.split(":")[1].trim(),
//         time: transactionTime.split("Hora:")[1].trim(),
//         place: transactionSite.split(":")[1].trim(),
//     }

//     res.status(200).json(response);
// };

export default {
    createUser,
    updateUser,
    getUser,
}