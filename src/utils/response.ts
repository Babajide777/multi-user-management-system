import { Response } from "express";

export const success = (res: Response, status: number, entity: any, msg: any) =>
  res.status(status || 200).json({
    success: true,
    message: msg || "Successful",
    payload: entity,
  });

export const fail = (res: Response, status: number, msg: any) =>
  res.status(status || 500).json({
    success: false,
    message: msg || "Failed",
    payload: [],
  });
