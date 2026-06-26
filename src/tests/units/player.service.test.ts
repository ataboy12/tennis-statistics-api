import { NotFoundError } from '../../errors'
import { PlayerRepository } from '../../repositories/player.repository'
import { PlayerService } from '../../services/player.service'
import { Player } from '../../types/player'

const player = (f: { id?: number; code?: string; rank?: number; weight?: number; height?: number; last?: number[] }): Player => ({
	id: f.id ?? 1,
	firstname: 'X',
	lastname: 'Y',
	shortname: 'X.Y',
	sex: 'M',
	country: { picture: '', code: f.code ?? 'AAA' },
	picture: '',
	data: {
		rank: f.rank ?? 1,
		points: 0,
		weight: f.weight ?? 80000,
		height: f.height ?? 180,
		age: 30,
		last: f.last ?? [1, 0, 1, 0],
	},
})

describe('PlayerService', () => {
	let playerRepository: jest.Mocked<Pick<PlayerRepository, 'findAll' | 'findById' | 'nextId' | 'create'>>
	let playerService: PlayerService

	beforeEach(() => {
		playerRepository = {
			findAll: jest.fn(),
			findById: jest.fn(),
			nextId: jest.fn(),
			create: jest.fn(),
		}
		playerService = new PlayerService(playerRepository as unknown as PlayerRepository)
	})

	describe('getAllSorted', () => {
		it('sorts by ascending rank', () => {
			playerRepository.findAll.mockReturnValue([player({ id: 1, rank: 3 }), player({ id: 2, rank: 1 }), player({ id: 3, rank: 2 })])
			expect(playerService.getAllSorted().map((p) => p.id)).toEqual([2, 3, 1])
		})

		it('does not mutate the source array', () => {
			const source = [player({ id: 1, rank: 3 }), player({ id: 2, rank: 1 })]
			playerRepository.findAll.mockReturnValue(source)
			playerService.getAllSorted()
			expect(source.map((p) => p.id)).toEqual([1, 2])
		})
	})

	describe('getById', () => {
		it('returns the player when found', () => {
			const p = player({ id: 52 })
			playerRepository.findById.mockReturnValue(p)
			expect(playerService.getById(52)).toBe(p)
		})

		it('throws NotFoundError when missing', () => {
			playerRepository.findById.mockReturnValue(undefined)
			expect(() => playerService.getById(999)).toThrow(NotFoundError)
		})
	})

	describe('create', () => {
		it('assigns the next id and delegates to the repository', () => {
			playerRepository.nextId.mockReturnValue(103)
			playerRepository.create.mockImplementation((p) => p)
			const input = { firstname: 'New' } as any
			const result = playerService.create(input)
			expect(playerRepository.create).toHaveBeenCalledWith({ id: 103, ...input })
			expect(result.id).toBe(103)
		})
	})

	describe('getStatistics', () => {
		it('picks the country with the highest win ratio', () => {
			playerRepository.findAll.mockReturnValue([player({ code: 'ESP', last: [1, 1, 1, 1] }), player({ code: 'USA', last: [0, 0, 1, 1] })])

			expect(playerService.getStatistics().countryWithBestWinRatio.code).toBe('ESP')
		})

		it('averages BMI with gram to kg and cm to m conversion', () => {
			playerRepository.findAll.mockReturnValue([player({ weight: 80000, height: 200 }), player({ weight: 50000, height: 100 })])

			expect(playerService.getStatistics().averageBmi).toBe(35)
		})

		it('computes median height for an odd count', () => {
			playerRepository.findAll.mockReturnValue([player({ height: 175 }), player({ height: 200 }), player({ height: 185 })])

			expect(playerService.getStatistics().medianHeight).toBe(185)
		})

		it('computes median height for an even count', () => {
			playerRepository.findAll.mockReturnValue([player({ height: 175 }), player({ height: 185 })])

			expect(playerService.getStatistics().medianHeight).toBe(180)
		})
	})
})
