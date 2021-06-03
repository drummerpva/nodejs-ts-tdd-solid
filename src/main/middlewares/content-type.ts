import { NextFunction, Request, Response } from 'express'

export const contentTypeJson = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.type('json')
  next()
}
