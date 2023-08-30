import { SiteFooter } from '@/components/site-footer'

interface LeetcodeAssistantProps {
	children: React.ReactNode
}

export const metadata = {
	title: {
		default: 'Leetcode Assistant',
		template: `%s | ${'Leetcode Assistant'}`,
	},
}

export default async function LeetcodeAssistant({
	children,
}: LeetcodeAssistantProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteFooter />

			<main className="flex-1">{children}</main>
		</div>
	)
}
