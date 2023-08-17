import Link from 'next/link'
import { Post } from '@prisma/client'

import { formatDate, getProblemDetails } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PostOperations } from '@/components/post-operations'
import { Icons } from './icons'

interface PostItemProps {
	post: Pick<Post, 'id' | 'title' | 'updatedAt' | 'mdId' | 'progress' | 'star'>
}

export function PostItem({ post }: PostItemProps) {
	const { category, problem } = getProblemDetails(post.mdId)
	return (
		<div className="flex items-center justify-between p-4">
			<div className="grid gap-1">
				<Link
					href={`/problems/${post.mdId}`}
					className="font-semibold hover:underline"
				>
					{problem} | {formatDate(post.updatedAt?.toDateString())}
				</Link>
				<div>
					<p className="inline-flex items-center text-sm text-muted-foreground">
						{category}{' '}
						<Icons.star
							className={`${
								post.star && ' text-yellow-400'
							} ml-2 inline h-4 w-4`}
						/>
						{post.progress === 'completed' ? (
							<Icons.checkCircle className="ml-2 inline h-4 w-4 text-green-500" />
						) : post.progress === 'in-progress' ? (
							<Icons.circleDashed className="ml-2 inline h-4 w-4 text-red-500" />
						) : null}
					</p>
				</div>
			</div>

			<PostOperations post={{ id: post.mdId, title: post.title }} />
		</div>
	)
}

PostItem.Skeleton = function PostItemSkeleton() {
	return (
		<div className="p-4">
			<div className="space-y-3">
				<Skeleton className="h-5 w-2/5" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	)
}
