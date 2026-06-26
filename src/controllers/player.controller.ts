import { Request, Response } from 'express'
import { PlayerService } from '../services/player.service'
import { ValidationError } from '../errors'
import { newPlayerSchema, updatePlayerSchema } from '../validation/player.schema'

export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	getAll = (_: Request, res: Response) => res.json(this.playerService.getAllSorted())

	getById = (req: Request, res: Response) => {
		const id = Number(req.params.id)

		if (!Number.isInteger(id)) {
			throw new ValidationError('id must be an integer')
		}

		res.json(this.playerService.getById(id))
	}

	create = (req: Request, res: Response) => {
		const parsed = newPlayerSchema.safeParse(req.body)

		if (!parsed.success) {
			throw new ValidationError(parsed.error.message)
		}

		res.status(201).json(this.playerService.create(parsed.data))
	}

	update = (req: Request, res: Response) => {
		const id = Number(req.params.id)

		if (!Number.isInteger(id)) {
			throw new ValidationError('id must be an integer')
		}

		const parsed = updatePlayerSchema.safeParse(req.body)

		if (!parsed.success) {
			throw new ValidationError(parsed.error.message)
		}

		res.json(this.playerService.update(id, parsed.data))
	}

	delete = (req: Request, res: Response) => {
		const id = Number(req.params.id)

		if (!Number.isInteger(id)) {
			throw new ValidationError('id must be an integer')
		}

		this.playerService.delete(id)
		res.status(204).send()
	}

	getStatistics = (_: Request, res: Response) => res.json(this.playerService.getStatistics())
}
