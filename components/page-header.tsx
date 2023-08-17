import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { Icons } from './icons'
import { ProblemLevel } from '@/constants/problem'

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	heading: string
	difficulty: string
	text?: string
}

export function DocsPageHeader({
	heading,
	text,
	difficulty,
	className,
	...props
}: DocsPageHeaderProps) {
	return (
		<>
			<div className={cn('space-y-4', className)} {...props}>
				<h1 className="inline-block font-heading text-4xl lg:text-5xl">
					{heading}
				</h1>
				<p>
					{difficulty === ProblemLevel.Easy ? (
						<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
							{difficulty}
						</span>
					) : difficulty === ProblemLevel.Medium ? (
						<span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
							{difficulty}
						</span>
					) : (
						<span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
							{difficulty}
						</span>
					)}
				</p>
				<p className="text-xl text-muted-foreground">
					{text ? <span className="mr-2">{text}</span> : ''}
					<button
						className={cn(
							buttonVariants({
								size: 'sm',
							}),
						)}
					>
						<a href="#note">
							<Icons.pencilLine className="mr-2 h-4 w-4" />
						</a>

						<a href="#note">Take a Note</a>
					</button>
				</p>
			</div>
			<hr className="my-4" />
		</>
	)
}
