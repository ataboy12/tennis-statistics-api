import { NotFoundError } from '../errors'
import { PlayerRepository } from '../repositories/player.repository'
import { Player } from '../types/player'
import { NewPlayerInput } from '../validation/player.schema'

export class PlayerService {
	constructor(private readonly playerRepository: PlayerRepository) {}

	getAllSorted(): Player[] {
		return [...this.playerRepository.findAll()].sort((a, b) => a.data.rank - b.data.rank)
	}

	getById(id: number): Player {
		const player = this.playerRepository.findById(id)

		if (!player) {
			throw new NotFoundError(`Player with id ${id} not found`)
		}

		return player
	}

	create(input: NewPlayerInput): Player {
		return this.playerRepository.create({
			id: this.playerRepository.nextId(),
			...input,
		})
	}
}
