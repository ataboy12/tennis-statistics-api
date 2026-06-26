import { Response } from 'express'
import { PlayerService } from '../../services/player.service'
import { PlayerController } from '../../controllers/player.controller'

const mockRes = () => {
	const r: any = {}
	r.status = jest.fn().mockReturnValue(r)
	r.json = jest.fn().mockReturnValue(r)
	return r as Response
}

describe('PlayerController', () => {
	let playerService: jest.Mocked<Pick<PlayerService, 'getAllSorted'>>
	let playerController: PlayerController

	beforeEach(() => {
		playerService = { getAllSorted: jest.fn() }
		playerController = new PlayerController(playerService as unknown as PlayerService)
	})

	it('returns the sorted list of players', () => {
		const list = [{ id: 1 }] as any
		playerService.getAllSorted.mockReturnValue(list)
		const res = mockRes()
		playerController.getAll({} as any, res)
		expect(res.json).toHaveBeenCalledWith(list)
	})
})
