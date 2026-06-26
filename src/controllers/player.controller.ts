import { Request, Response } from 'express'
import { PlayerService } from '../services/player.service'
import { ValidationError } from '../errors'

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
}
