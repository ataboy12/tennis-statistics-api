import { PlayerRepository } from '../repositories/player.repository'
import { Player } from '../types/player'

export class PlayerService {
	constructor(private readonly playerRepository: PlayerRepository) {}

	getAllSorted(): Player[] {
		return [...this.playerRepository.findAll()].sort((a, b) => a.data.rank - b.data.rank)
	}
}
