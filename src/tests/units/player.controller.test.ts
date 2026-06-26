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
	let playerService: jest.Mocked<Pick<PlayerService, 'getAllSorted' | 'getById' | 'create'>>
	let playerController: PlayerController

	beforeEach(() => {
		playerService = {
			getAllSorted: jest.fn(),
			getById: jest.fn(),
			create: jest.fn(),
		}
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

	it('create responds 201 with the created player', () => {
		const created = { id: 103 } as any
		playerService.create.mockReturnValue(created)
		const res = mockRes()
		const validBody = {
			firstname: 'Rafael',
			lastname: 'Nadal',
			shortname: 'R.NAD',
			sex: 'M',
			country: { picture: 'https://example.com/flag.png', code: 'ESP' },
			picture: 'https://example.com/player.png',
			data: {
				rank: 1,
				points: 1000,
				weight: 85000,
				height: 185,
				age: 37,
				last: [1, 0, 1, 1],
			},
		}

		playerController.create({ body: validBody } as any, res)

		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith(created)
	})

	it('create throws ValidationError on an invalid body', () => {
		const res = mockRes()

		expect(() => playerController.create({ body: { firstname: '' } } as any, res)).toThrow(ValidationError)
	})
})
