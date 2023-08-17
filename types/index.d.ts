import { User } from '@prisma/client'
import type { Icon } from 'lucide-react'

import { Icons } from '@/components/icons'

export type SubscriptionPlan = {
	name: string
	description: string
	stripePriceId: string
}

export type NavItem = {
	title: string
	href: string
	disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
	title: string
	disabled?: boolean
	external?: boolean
	icon?: keyof typeof Icons
} & (
	| {
			href: string
			items?: never
	  }
	| {
			href?: string
			items: NavLink[]
	  }
)

export type Problems = {
	title: string
	items: {
		title: string
		href: string
		mdId: string
		level: ProblemLevel
		star?: boolean
		progress?: string
	}[]
}

export type ProblemsConfig = {
	problems: Problems[]
}

export type DashboardConfig = {
	mainNav: MainNavItem[]
	sidebarNav: SidebarNavItem[]
}

export type SiteConfig = {
	name: string
	description: string
	url: string
	links: {
		website: string
		github: string
	}
}
