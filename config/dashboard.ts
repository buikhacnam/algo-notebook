import { DashboardConfig } from 'types'

export const dashboardConfig: DashboardConfig = {
	mainNav: [
		{
			title: 'About',
			href: '/about',
			disabled: true,
		},
		{
			title: 'Support',
			href: '/support',
			disabled: true,
		},
	],
	sidebarNav: [
		{
			title: 'Problems',
			href: '/dashboard',
			icon: 'terminalSquare',
		},
		{
			title: 'Your Notes',
			href: '/dashboard/notes',
			icon: 'pencilLine',
		},
		{
			title: 'Your Stars',
			href: '/dashboard/stars',
			icon: 'star',
		},
	],
}
