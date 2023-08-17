import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { ProblemLevel } from '@/constants/problem'
import { Icons } from './icons'

interface ProblemItemProps {
	problem: {
		mdId: string
		href: string
		title: string
		level: ProblemLevel
		progress?: string
		star?: boolean
	}
}

export function ProblemItem({ problem }: ProblemItemProps) {
	return (
		<div className="flex items-center justify-between p-4">
			<div className="grid gap-1">
				<Link href={problem.href} className="font-semibold hover:underline">
					{problem.title}
				</Link>
				<div>
					<p className="inline-flex items-center text-sm text-muted-foreground">
						<span
							className={`${
								problem.level === ProblemLevel.Easy
									? 'text-green-500'
									: problem.level === ProblemLevel.Medium
									? 'text-yellow-500'
									: 'text-red-500'
							}`}
						>
							{problem.level}
						</span>

						<Icons.star
							className={`${
								problem.star && ' text-yellow-400'
							} ml-2 inline h-4 w-4`}
						/>

						{problem.progress === 'completed' ? (
							<Icons.checkCircle className="ml-2 inline h-4 w-4 text-green-500" />
						) : problem.progress === 'in-progress' ? (
							<Icons.circleDashed className="ml-2 inline h-4 w-4 text-red-500" />
						) : null}
					</p>
				</div>
			</div>

			{/* <PostOperations post={{ id: post.id, title: post.title }} /> */}
		</div>
	)
}

ProblemItem.Skeleton = function PostItemSkeleton() {
	return (
		<div className="p-4">
			<div className="space-y-3">
				<Skeleton className="h-5 w-2/5" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	)
}
