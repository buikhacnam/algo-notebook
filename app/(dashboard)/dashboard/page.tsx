import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { DashboardHeader } from '@/components/header'
import { DashboardShell } from '@/components/shell'
import { problemsConfig } from '@/config/problems'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { ProblemItem } from '@/components/problem-item'
export const metadata = {
	title: 'Problems',
}

export default async function DashboardPage() {
	const user = await getCurrentUser()

	const problems = problemsConfig.problems
	if (user) {
		const posts = await db.post.findMany({
			where: {
				authorId: user.id,
			},
			select: {
				id: true,
				createdAt: true,
				star: true,
				progress: true,
				mdId: true,
			},
		})

		//merge posts to problems items
		problems.forEach((category) => {
			category?.items &&
				category?.items?.length > 0 &&
				category.items.forEach((problem) => {
					const post = posts.find((post) => post.mdId === problem.mdId)
					if (post) {
						problem.star = post?.star || false
						problem.progress = post?.progress || 'none'
					}
				})
		})
	}

	return (
		<DashboardShell>
			<DashboardHeader heading="Problems" text="all problems"></DashboardHeader>
			<div>
				{problems?.length ? (
					<div className="">
						<Accordion type="multiple" className="w-full">
							{problems.map((category) => (
								<AccordionItem
									key={category.title}
									value={category?.title || ''}
								>
									<AccordionTrigger>{category.title}</AccordionTrigger>
									<AccordionContent>
										{category?.items &&
											category?.items?.length > 0 &&
											category.items.map((problem) => (
												<div
													key={problem.mdId}
													className="divide-y divide-border rounded-md border"
												>
													<ProblemItem problem={problem} />
												</div>
											))}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				) : (
					<EmptyPlaceholder></EmptyPlaceholder>
				)}
			</div>
		</DashboardShell>
	)
}
