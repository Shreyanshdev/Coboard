import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "excalidraw_secret_key_123";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] || req.headers["Authorization"];
  
  if (!token || typeof token !== "string") {
    res.status(403).json({ message: "Unauthorized - missing token" });
    return;
  }

  try {
    const bearerToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(bearerToken, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(403).json({ message: "Unauthorized - invalid token" });
  }
}
