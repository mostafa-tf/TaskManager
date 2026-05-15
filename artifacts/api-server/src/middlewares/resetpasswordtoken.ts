import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const resetpasswordtoken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(404).json({ message: "no token provided in headers" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unvalid token" });
  }
};
