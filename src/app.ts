import express from 'express'
import { PlayerController } from './controllers/player.controller'
import { PlayerService } from './services/player.service'
import { PlayerRepository } from './repositories/player.repository'
import { playerRoutes } from './routes/player.routes'
import { errorHandler } from './middlewares/error-handler'

export function createApp() {
	const app = express()

	app.use(express.json())

	const playerRepository = new PlayerRepository()
	const playerService = new PlayerService(playerRepository)
	const playerController = new PlayerController(playerService)

	app.get('/health', (_req, res) => res.json({ status: 'ok' }))
	app.use('/players', playerRoutes(playerController))
	app.use(errorHandler)

	return app
}
