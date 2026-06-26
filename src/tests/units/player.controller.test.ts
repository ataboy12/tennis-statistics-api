import { Response } from 'express'
import { PlayerService } from '../../services/player.service'
import { PlayerController } from '../../controllers/player.controller'
import { ValidationError } from '../../errors'

const mockRes = () => {
	const r: any = {}
	r.status = jest.fn().mockReturnValue(r)
	r.json = jest.fn().mockReturnValue(r)
	return r as Response
}

describe('PlayerController', () => {
	let playerService: jest.Mocked<Pick<PlayerService, 'getAllSorted' | 'getById'>>
	let playerController: PlayerController

	beforeEach(() => {
		playerService = { getAllSorted: jest.fn(), getById: jest.fn() }
		playerController = new PlayerController(playerService as unknown as PlayerService)
	})

	it('findAll returns the sorted list of players', () => {
		const list = [{ id: 1 }] as any
		playerService.getAllSorted.mockReturnValue(list)
		const res = mockRes()
		playerController.getAll({} as any, res)
		expect(res.json).toHaveBeenCalledWith(list)
	})

	it('getById throws ValidationError on a non integer id', () => {
		const res = mockRes()
		expect(() => playerController.getById({ params: { id: 'abc' } } as any, res)).toThrow(ValidationError)
		expect(playerService.getById).not.toHaveBeenCalled()
	})
})
