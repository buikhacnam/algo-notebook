import { getServerSession } from 'next-auth/next'
import * as z from 'zod'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RequiresProPlanError } from '@/lib/exceptions'
import { getUserSubscriptionPlan } from '@/lib/subscription'
import { postPatchSchema } from '@/lib/validations/post'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return new Response('Unauthorized', { status: 403 })
		}

		const { user } = session
		const posts = await db.post.findMany({
			select: {
				id: true,
				title: true,
				published: true,
				createdAt: true,
			},
			where: {
				authorId: user.id,
			},
		})

		return new Response(JSON.stringify(posts))
	} catch (error) {
		return new Response(null, { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return new Response('Unauthorized', { status: 403 })
		}

		const { user } = session
		const subscriptionPlan = await getUserSubscriptionPlan(user.id)

		// If user is on a free plan.
		// Check if user has reached limit of 100 posts.
		if (!subscriptionPlan?.isPro) {
			const count = await db.post.count({
				where: {
					authorId: user.id,
				},
			})

			if (count >= 100) {
				throw new RequiresProPlanError()
			}
		}

		const json = await req.json()
		const body = postPatchSchema.parse(json)

		const post = await db.post.create({
			data: {
				title: body.title || 'Note',
				content: body.content,
				mdId: body.mdId || '',
				progress: body?.progress || '',
				star: body.star,
				published: body.published,
				authorId: user.id,
			},
			select: {
				id: true,
			},
		})

		return new Response(JSON.stringify(post))
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(JSON.stringify(error.issues), { status: 422 })
		}

		if (error instanceof RequiresProPlanError) {
			return new Response('Requires Pro Plan', { status: 402 })
		}

		return new Response(null, { status: 500 })
	}
}
