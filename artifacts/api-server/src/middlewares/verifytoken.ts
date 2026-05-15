import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifytoken = (req: Request, res: Response, next: NextFunction): void => {
  const completetoken = req.headers.authorization;
  if (!completetoken) {
    res.status(401).json({ message: "you must send token also" });
    return;
  }
  try {
    const arraytoken = completetoken.split(" ");
    const decoded = jwt.verify(arraytoken[1], process.env.JWT_KEY as string) as { id: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unvalid token" });
  }
};
