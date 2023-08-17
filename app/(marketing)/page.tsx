import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function IndexPage() {
	return (
		<>
			<section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
				<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
					<h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
						Everyday Algorithms
					</h1>
					<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
						A free open source application for you to revise algorithm problems
						and take your own notes.
					</p>
					<div className="space-x-4">
						<Link
							href="/dashboard"
							className={cn(buttonVariants({ size: 'lg' }))}
						>
							Get Started
						</Link>
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noreferrer"
							className={cn(
								buttonVariants({
									variant: 'outline',
									size: 'lg',
								}),
							)}
						>
							Github
						</Link>
					</div>
				</div>
			</section>
			<section
				id="features"
				className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
			>
				<div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
					<h2 className="font-heading text-xl leading-[1.1] sm:text-4xl md:text-5xl">
						Features
					</h2>
				</div>
				<div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
					<div className="relative overflow-hidden rounded-lg border bg-background p-2">
						<div className="flex h-[160px] flex-col justify-between rounded-md p-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								className="lucide lucide-laptop"
							>
								<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
							</svg>
							<div className="space-y-2">
								<h3 className="font-semibold">Quick algorithms revision.</h3>
							</div>
						</div>
					</div>
					<div className="relative overflow-hidden rounded-lg border bg-background p-2">
						<div className="flex h-[160px] flex-col justify-between rounded-md p-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								className="lucide lucide-pencil-line"
							>
								<path d="M12 20h9" />
								<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
								<path d="m15 5 3 3" />
							</svg>
							<div className="space-y-2">
								<h3 className="font-semibold">Take your own notes.</h3>
							</div>
						</div>
					</div>
					<div className="relative overflow-hidden rounded-lg border bg-background p-2">
						<div className="flex h-[160px] flex-col justify-between rounded-md p-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								className="lucide lucide-code"
							>
								<polyline points="16 18 22 12 16 6" />
								<polyline points="8 6 2 12 8 18" />
							</svg>
							<div className="space-y-2">
								<h3 className="font-semibold">All main languages included.</h3>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
