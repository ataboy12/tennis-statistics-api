import data from '../data/players.json'
import { Player } from '../types/player'

export class PlayerRepository {
	private players: Player[] = [...(data as { players: Player[] }).players]

	findAll(): Player[] {
		return this.players
	}

	findById(id: number): Player | undefined {
		return this.players.find((p) => p.id === id)
	}
}
