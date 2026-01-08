import { Request, Response, NextFunction } from "express";
import { jwtAdapter } from "../config/jwt.adapter";
import { UserToken } from "../../types/express";

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded: UserToken | null = await jwtAdapter.validateToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    
    next();
}

export default {
    validateJWT,
}