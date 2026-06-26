import { newPlayerSchema } from '../../validation/player.schema'

const valid = {
	firstname: 'Carlos',
	lastname: 'Alcaraz',
	shortname: 'C.ALC',
	sex: 'M',
	country: { picture: 'https://x/ESP.png', code: 'ESP' },
	picture: 'https://x/alcaraz.png',
	data: { rank: 3, points: 5000, weight: 74000, height: 183, age: 21, last: [1, 1, 0, 1, 1] },
}

it('accepts a valid player', () => {
	expect(newPlayerSchema.safeParse(valid).success).toBe(true)
})

it('rejects an unknown sex value', () => {
	expect(newPlayerSchema.safeParse({ ...valid, sex: 'X' }).success).toBe(false)
})

it('rejects a results array with values other than 0 or 1', () => {
	const bad = { ...valid, data: { ...valid.data, last: [1, 2, 0] } }
	expect(newPlayerSchema.safeParse(bad).success).toBe(false)
})
