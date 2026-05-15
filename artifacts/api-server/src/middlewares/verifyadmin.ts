import { Request, Response, NextFunction } from "express";

export const verifyadmin = (req: Request, res: Response, next: NextFunction): void => {
  if ((req as any).user?.role !== "admin") {
    res.status(403).json({ message: "permission blocked You Must be an Admin" });
    return;
  }
  next();
};
