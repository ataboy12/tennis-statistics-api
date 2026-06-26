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

	create(player: Player): Player {
		this.players.push(player)
		return player
	}

	update(player: Player): Player {
		const index = this.players.findIndex((p) => p.id === player.id)
		this.players[index] = player
		return player
	}

	delete(id: number): void {
		this.players = this.players.filter((p) => p.id !== id)
	}

	nextId(): number {
		return this.players.reduce((max, p) => Math.max(max, p.id), 0) + 1
	}
}
