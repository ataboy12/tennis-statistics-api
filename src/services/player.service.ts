import { NotFoundError } from '../errors'
import { PlayerRepository } from '../repositories/player.repository'
import { Player } from '../types/player'
import { Statistics } from '../types/statistics'
import { NewPlayerInput, UpdatePlayerInput } from '../validation/player.schema'

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

	update(id: number, input: UpdatePlayerInput): Player {
		const existing = this.getById(id)

		const updated: Player = {
			...existing,
			...input,
			country: { ...existing.country, ...input.country },
			data: { ...existing.data, ...input.data },
		}

		return this.playerRepository.update(updated)
	}

	delete(id: number): void {
		this.getById(id)
		this.playerRepository.delete(id)
	}

	getStatistics(): Statistics {
		const players = this.playerRepository.findAll()

		// Country with highest win ratio
		const byCountry = new Map<string, { wins: number; games: number }>()

		for (const player of players) {
			const agg = byCountry.get(player.country.code) ?? { wins: 0, games: 0 }
			agg.wins += player.data.last.filter((r) => r === 1).length
			agg.games += player.data.last.length
			byCountry.set(player.country.code, agg)
		}

		let best = { code: '', ratio: -1 }
		for (const [code, { wins, games }] of byCountry) {
			const ratio = games === 0 ? 0 : wins / games
			if (ratio > best.ratio) best = { code, ratio }
		}

		// Average BMI
		const bmis = players.map((p) => {
			const kg = p.data.weight / 1000
			const m = p.data.height / 100
			return kg / (m * m)
		})

		const averageBmi = bmis.reduce((s, v) => s + v, 0) / bmis.length

		// Median height
		const heights = players.map((p) => p.data.height).sort((a, b) => a - b)
		const mid = Math.floor(heights.length / 2)
		const medianHeight = heights.length % 2 ? heights[mid] : (heights[mid - 1] + heights[mid]) / 2

		return {
			countryWithBestWinRatio: { code: best.code, ratio: Number(best.ratio.toFixed(4)) },
			averageBmi: Number(averageBmi.toFixed(2)),
			medianHeight,
		}
	}
}
