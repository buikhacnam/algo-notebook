import { notFound } from 'next/navigation'
import { allProblems } from 'contentlayer/generated'

import { getTableOfContents } from '@/lib/toc'
import { Mdx } from '@/components/mdx-components'
import { DocsPageHeader } from '@/components/page-header'
import { DocsPager } from '@/components/pager'
import { DashboardTableOfContents } from '@/components/toc'
import { db } from '@/lib/db'

import '@/styles/mdx.css'
import { Metadata } from 'next'

import { absoluteUrl } from '@/lib/utils'
import { User, Post } from '@prisma/client'
import { getCurrentUser } from '@/lib/session'
import { Editor } from '@/components/editor'
export const dynamic = 'force-dynamic'
interface DocPageProps {
	params: {
		slug: string[]
	}
}

async function getPostForUser(mdId: Post['mdId'], userId: User['id']) {
	const post = await db.post.findFirst({
		where: {
			mdId: mdId,
			authorId: userId,
		},
	})

	return post
}

async function getDocFromParams(params) {
	const slug = params.slug?.join('/') || ''
	const doc = allProblems.find((doc) => doc.slugAsParams === slug)

	if (!doc) {
		null
	}

	return doc
}

export async function generateMetadata({
	params,
}: DocPageProps): Promise<Metadata> {
	const doc = await getDocFromParams(params)

	if (!doc) {
		return {}
	}

	const url = process.env.NEXT_PUBLIC_APP_URL

	const ogUrl = new URL(`${url}/api/og`)
	ogUrl.searchParams.set('heading', doc.title ?? doc.category)
	ogUrl.searchParams.set('type', doc.category || 'Problem')
	ogUrl.searchParams.set('mode', 'dark')

	return {
		title: doc.title,
		description: doc.category,
		openGraph: {
			title: doc.title,
			description: doc.category,
			type: 'article',
			url: absoluteUrl(doc.slug),
			images: [
				{
					url: ogUrl.toString(),
					width: 1200,
					height: 630,
					alt: doc.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: doc.title,
			description: doc.category,
			images: [ogUrl.toString()],
		},
	}
}

export async function generateStaticParams(): Promise<
	DocPageProps['params'][]
> {
	return allProblems.map((doc) => ({
		slug: doc.slugAsParams.split('/'),
	}))
}

export default async function DocPage({ params }: DocPageProps) {
	const mdId = params.slug.join('/')
	const user = await getCurrentUser()

	const post = await getPostForUser(mdId, user?.id || '')

	const doc = await getDocFromParams(params)

	if (!doc) {
		notFound()
	}

	const toc = await getTableOfContents(doc.body.raw)

	return (
		<main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
			<div className="mx-auto w-full min-w-0">
				<DocsPageHeader
					heading={doc.title}
					text={doc.category}
					difficulty={doc.difficulty}
				/>
				<Mdx code={doc.body.code} />
				<Editor
					post={{
						id: post?.id || '',
						title: post?.title || 'Note',
						content: post?.content || '',
						published: post?.published || false,
						progress: post?.progress || '',
						star: post?.star || false,
						mdId: mdId,
						authorId: user?.id || '',
					}}
					user={user}
				/>
				<DocsPager doc={doc} />
			</div>
			<div className="hidden text-sm xl:block">
				<div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
					<DashboardTableOfContents toc={toc} />
				</div>
			</div>
		</main>
	)
}
