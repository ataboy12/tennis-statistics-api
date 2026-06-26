import { Router } from 'express'
import { PlayerController } from '../controllers/player.controller'

export function playerRoutes(playerController: PlayerController): Router {
	const router = Router()
	router.get('/', playerController.getAll)
	router.get('/:id', playerController.getById)
	router.post('/', playerController.create)

	return router
}
