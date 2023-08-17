import * as z from 'zod'

export const postPatchSchema = z.object({
	title: z.string().min(3).max(128).optional(),
	content: z.any().optional(),
	mdId: z.string().optional(),
	progress: z.string().optional(),
	published: z.boolean().optional(),
	star: z.boolean().optional(),
	authorId: z.string().optional(),
})
