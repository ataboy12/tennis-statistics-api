import { z } from 'zod'

const countrySchema = z.object({
	picture: z.string().url(),
	code: z.string().length(3),
})

const playerDataSchema = z.object({
	rank: z.number().int().positive(),
	points: z.number().int().nonnegative(),
	weight: z.number().positive(),
	height: z.number().positive(),
	age: z.number().int().positive(),
	last: z.array(z.union([z.literal(0), z.literal(1)])),
})

export const newPlayerSchema = z.object({
	firstname: z.string().min(1),
	lastname: z.string().min(1),
	shortname: z.string().min(1),
	sex: z.enum(['M', 'F']),
	country: countrySchema,
	picture: z.string().url(),
	data: playerDataSchema,
})

export const updatePlayerSchema = z
	.object({
		firstname: z.string().min(1),
		lastname: z.string().min(1),
		shortname: z.string().min(1),
		sex: z.enum(['M', 'F']),
		country: countrySchema.partial(),
		picture: z.string().url(),
		data: playerDataSchema.partial(),
	})
	.partial()
	.refine((body) => Object.keys(body).length > 0, { message: 'At least one field must be provided' })

export type NewPlayerInput = z.infer<typeof newPlayerSchema>
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>
