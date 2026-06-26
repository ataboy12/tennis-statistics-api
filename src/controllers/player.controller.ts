import { Request, Response } from 'express'
import { PlayerService } from '../services/player.service'

export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	getAll = (_: Request, res: Response) => res.json(this.playerService.getAllSorted())
}
