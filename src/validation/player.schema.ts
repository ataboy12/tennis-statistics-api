import { z } from 'zod'

export const newPlayerSchema = z.object({
	firstname: z.string().min(1),
	lastname: z.string().min(1),
	shortname: z.string().min(1),
	sex: z.enum(['M', 'F']),
	country: z.object({ picture: z.string().url(), code: z.string().length(3) }),
	picture: z.string().url(),
	data: z.object({
		rank: z.number().int().positive(),
		points: z.number().int().nonnegative(),
		weight: z.number().positive(),
		height: z.number().positive(),
		age: z.number().int().positive(),
		last: z.array(z.union([z.literal(0), z.literal(1)])),
	}),
})

export type NewPlayerInput = z.infer<typeof newPlayerSchema>
