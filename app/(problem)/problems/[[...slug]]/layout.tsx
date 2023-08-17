import { dashboardConfig } from '@/config/dashboard'
import { getCurrentUser } from '@/lib/session'
import { MainNav } from '@/components/main-nav'
import { DashboardNav } from '@/components/nav'
import { SiteFooter } from '@/components/site-footer'
import { UserAccountNav } from '@/components/user-account-nav'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
export const dynamic = 'force-dynamic'
interface DashboardLayoutProps {
	children?: React.ReactNode
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const user = await getCurrentUser()

	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<MainNav items={dashboardConfig.mainNav} />
					{user ? (
						<UserAccountNav
							user={{
								name: user.name,
								image: user.image,
								email: user.email,
							}}
						/>
					) : (
						<nav>
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
						</nav>
					)}
				</div>
			</header>
			<div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<DashboardNav items={dashboardConfig.sidebarNav} />
				</aside>
				<main className="flex w-full flex-1 flex-col overflow-hidden lg:overflow-visible">
					{children}
				</main>
			</div>
			<SiteFooter className="border-t" />
		</div>
	)
}
