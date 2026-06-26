import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'

export function errorHandler(err: Error, _: Request, res: Response, _next: NextFunction) {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({ error: err.name, message: err.message })
	}

	console.error(err)

	return res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong' })
}
