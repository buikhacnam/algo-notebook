import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { DashboardHeader } from '@/components/header'
import { PostItem } from '@/components/post-item'
import { DashboardShell } from '@/components/shell'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
	title: 'Problems',
}

export default async function DashboardPage() {
	const user = await getCurrentUser()
	let posts: any = []
	if (user) {
		const p = await db.post.findMany({
			where: {
				authorId: user.id,
				star: true,
			},
			select: {
				id: true,
				title: true,
				updatedAt: true,
				mdId: true,
				star: true,
				progress: true,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		})
		posts = p
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading="Your Notes"
				text="problems with your notes"
			></DashboardHeader>
			<div>
				{posts?.length ? (
					<div className="divide-y divide-border rounded-md border">
						{posts.map((post) => (
							<PostItem key={post.id} post={post} />
						))}
					</div>
				) : !user ? (
					<EmptyPlaceholder>
						<EmptyPlaceholder.Icon name="star" />
						<EmptyPlaceholder.Title>
							Login to see your starred problems
						</EmptyPlaceholder.Title>
						<EmptyPlaceholder.Description>
							<Link
								href="/login"
								className={cn(
									buttonVariants({
										variant: 'secondary',
										size: 'sm',
									}),
									'px-4',
								)}
							>
								Login
							</Link>
						</EmptyPlaceholder.Description>
					</EmptyPlaceholder>
				) : (
					<EmptyPlaceholder>
						<EmptyPlaceholder.Icon name="star" />
						<EmptyPlaceholder.Title>No starred problems</EmptyPlaceholder.Title>
						<EmptyPlaceholder.Description>
							You don&apos;t have any starred problems yet.
						</EmptyPlaceholder.Description>
					</EmptyPlaceholder>
				)}
			</div>
		</DashboardShell>
	)
}
