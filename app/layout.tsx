import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'

import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
	src: '../assets/fonts/CalSans-SemiBold.woff2',
	variable: '--font-heading',
})

interface RootLayoutProps {
	children: React.ReactNode
}

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		'Next.js',
		'Server Components',
		'shadcn-ui',
		'Algorigthms',
		'MDX',
		'Markdown',
		'Contentlayer',
	],
	authors: [
		{
			name: 'casey bui',
			url: 'https://buinam.com',
		},
	],
	creator: 'casey bui',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: `${siteConfig.url}/og.png`,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`${siteConfig.url}/og.png`],
		creator: '@buikhacnam11',
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
	},
	manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
					fontHeading.variable,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
					<Toaster />
					<TailwindIndicator />
				</ThemeProvider>
			</body>
		</html>
	)
}
