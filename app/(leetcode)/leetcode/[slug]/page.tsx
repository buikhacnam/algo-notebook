import { cn } from '@/lib/utils'
import React, { CSSProperties } from 'react'
import { parse, HTMLChild } from 'himalaya'
import Image from 'next/image'
import { ProblemLevel } from '@/constants/problem'
import { CodeBlock } from '@/components/code-block'
import { YouTubePlayer } from '@/components/youtube'

const searchYouTubeVideos = async (searchQuery: string) => {
	try {
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${process.env.GOOGLE_API_KEY}&type=video&maxResults=1`,
		)

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}

		const data = await response.json()

		// Handle the response data here
		const videos = data.items
		return videos[0]
	} catch (error) {
		console.error('Error fetching YouTube data:', error.message)
	}
}

const leetCodeGraphqlUrl = 'https://leetcode.com/graphql'

const leetCodeRequestBody = {
	query:
		'\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    questionFrontendId\n    title\n  difficulty\n }\n}\n    ',
	variables: {
		titleSlug: '',
	},
	operationName: 'questionContent',
}

const neetCodeRepo =
	'https://raw.githubusercontent.com/neetcode-gh/leetcode/main/'

async function getProblemDetail(slug: string) {
	try {
		const url = new URL(leetCodeGraphqlUrl)
		const requestBody = leetCodeRequestBody

		requestBody.variables.titleSlug = slug

		const problem = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		const problemJson = await problem.json()

		const questionFrontendId = problemJson.data.question.questionFrontendId

		const javascriptUrl = `${neetCodeRepo}javascript/${neetCodePadNumber(
			questionFrontendId,
		)}-${slug}.js`
		const pythonUrl = `${neetCodeRepo}python/${neetCodePadNumber(
			questionFrontendId,
		)}-${slug}.py`
		const cppUrl = `${neetCodeRepo}cpp/${neetCodePadNumber(
			questionFrontendId,
		)}-${slug}.cpp`
		const javaUrl = `${neetCodeRepo}java/${neetCodePadNumber(
			questionFrontendId,
		)}-${slug}.java`

		let javascriptSolution = 'javascript solution will be updated soon!'
		let pythonSolution = 'python solution will be updated soon!'
		let cppSolution = 'c++ solution will be updated soon!'
		let javaSolution = 'java solution will be updated soon!'

		// fetch the solutions from neetcode repo
		try {
			const javascriptResponse = await fetch(javascriptUrl)
			if (javascriptResponse.ok) {
				javascriptSolution = await javascriptResponse.text()
			}
		} catch (error) {
			console.log(`Failed to fetch javascript solution from ${javascriptUrl}`)
		}

		try {
			const pythonResponse = await fetch(pythonUrl)
			if (pythonResponse.ok) {
				pythonSolution = await pythonResponse.text()
			}
		} catch (error) {
			console.log(`Failed to fetch python solution from ${pythonUrl}`)
		}

		try {
			const cppResponse = await fetch(cppUrl)
			if (cppResponse.ok) {
				cppSolution = await cppResponse.text()
			}
		} catch (error) {
			console.log(`Failed to fetch cpp solution from ${cppUrl}`)
		}

		try {
			const javaResponse = await fetch(javaUrl)
			if (javaResponse.ok) {
				javaSolution = await javaResponse.text()
			}
		} catch (error) {
			console.log(`Failed to fetch java solution from ${javaUrl}`)
		}

		return {
			body: problemJson.data.question.content,
			title: problemJson.data.question.title,
			difficulty: problemJson.data.question.difficulty,
			questionFrontendId: problemJson.data.question.questionFrontendId,
			solutuions: {
				javascript: javascriptSolution,
				python: pythonSolution,
				cpp: cppSolution,
				java: javaSolution,
			},
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

function ProblemContent({ children }) {
	return <div className="p-4">{children}</div>
}

export default async function ExperimentPage({
	params,
}: {
	params: {
		slug: string
	}
}) {
	const slug = params.slug
	const problem = await getProblemDetail(slug)

	if (!problem) {
		return <div>Problem not found</div>
	}

	const video = await searchYouTubeVideos(`
    ${problem.title} leetcode tutorial
  `)

	const children = mapElements(parse(problem.body))
	return (
		<div className="px-8 py-4">
			<h1 className="text-4xl font-bold tracking-tight">
				{problem.questionFrontendId}. {problem.title}
			</h1>
			<h2
				className={`${
					problem.difficulty === ProblemLevel.Easy
						? 'text-green-500'
						: problem.difficulty === ProblemLevel.Medium
						? 'text-yellow-500'
						: 'text-red-500'
				} font-bold`}
			>
				{problem.difficulty}
			</h2>

			<ProblemContent>{children}</ProblemContent>

			{video && <YouTubePlayer videoId={video.id.videoId} />}

			<h2 className="mb-4 text-2xl font-semibold tracking-tight">Solutions</h2>
			{Object.keys(problem.solutuions).map((key) => {
				return (
					<div key={key}>
						<h4 className="text-xl font-semibold tracking-tight">
							{key.toLocaleUpperCase()}
						</h4>
						<CodeBlock text={problem.solutuions[key]} language={key} />
					</div>
				)
			})}
		</div>
	)
}

const mapElements = (parsed: HTMLChild[]) => {
	if (!parsed) return null

	return parsed.map((node, index) => {
		if (node.type === 'text') {
			return decodeHtmlEntities(node.content)
		}

		const { tagName, children, attributes } = node

		if (!tagName) {
			return null
		}

		const Component = components[tagName]

		if (!Component) {
			return null
		}

		const props: { [key: string]: string | undefined } = {}

		if (attributes) {
			attributes.forEach(({ key, value }) => {
				if (key === 'style') {
					;(props as { [key: string]: CSSProperties })[key] =
						parseInlineStyles(value)

					return
				}

				props[key] = value
			})
		}

		return (
			<Component key={index} {...props}>
				{mapElements(children as HTMLChild[])}
			</Component>
		)
	})
}

const components: any = {
	h1: ({ className, ...props }) => (
		<h1
			className={cn(
				'mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }) => (
		<h2
			className={cn(
				'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }) => (
		<h3
			className={cn(
				'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }) => (
		<h4
			className={cn(
				'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }) => (
		<h5
			className={cn(
				'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }) => (
		<h6
			className={cn(
				'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }) => (
		<a
			className={cn('font-medium underline underline-offset-4', className)}
			{...props}
		/>
	),
	p: ({ className, ...props }) => (
		<p
			className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
			suppressHydrationWarning
			{...props}
		>
			{props.children}
		</p>
	),
	ul: ({ className, ...props }) => (
		<ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
	),
	ol: ({ className, ...props }) => (
		<ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
	),
	li: ({ className, ...props }) => (
		<li className={cn('mt-2', className)} {...props} />
	),
	blockquote: ({ className, ...props }) => (
		<blockquote
			className={cn(
				'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
				className,
			)}
			{...props}
		/>
	),
	img: ({ src, style }) => {
		// eslint-disable-next-line @next/next/no-img-element
		return <Image src={src} width={500} height={200} alt="" />
	},
	hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-y-auto">
			<table className={cn('w-full', className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={cn('m-0 border-t p-0 even:bg-muted', className)}
			{...props}
		/>
	),
	th: ({ className, ...props }) => (
		<th
			className={cn(
				'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
				className,
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }) => (
		<td
			className={cn(
				'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
				className,
			)}
			{...props}
		/>
	),
	pre: ({ className, ...props }) => (
		<pre
			className={cn(
				'mb-4 mt-6 overflow-x-auto rounded-lg border p-4',
				className,
			)}
			{...props}
		/>
	),
	code: ({ className, ...props }) => (
		<code
			className={cn(
				'relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm',
				className,
			)}
			{...props}
		/>
	),
	strong: ({ className, ...props }) => (
		<strong className={cn('font-semibold', className)} {...props} />
	),
}

const parseInlineStyles = (styleAttributeValue: string) => {
	const entries = styleAttributeValue
		.replace('!important', '')
		.split(';')
		.filter((cssProperty) => cssProperty)
		.map((cssProperty) => {
			const i = cssProperty.indexOf(':')
			const splits = [cssProperty.slice(0, i), cssProperty.slice(i + 1)]

			return splits.map((entry) => entry.trim())
		})
		.map(([key, value]) => {
			const splitKey = key.split('-')

			if (splitKey.length === 1) {
				return [key, value]
			}

			const camelCaseKey = splitKey
				.map((word, index) => {
					if (index === 0) {
						return word
					}

					return word.charAt(0).toUpperCase() + word.slice(1)
				})
				.join('')

			return [camelCaseKey, value]
		}) as [string, string][]

	const entriesMap = new Map<string, string>(entries)

	return Object.fromEntries(entriesMap) as CSSProperties
}

function decodeHtmlEntities(text) {
	return text.replace(/&[#A-Za-z0-9]+;/g, (match) => {
		const entityMap = {
			'&lt;': '<',
			'&gt;': '>',
			'&amp;': '&',
			'&quot;': '"',
			'&apos;': "'",
			'&nbsp;': ' ',
			// Add more entity replacements as needed
		}
		const entity = entityMap[match]
		return entity || match
	})
}

function neetCodePadNumber(input: number | string): string {
	const num = typeof input === 'string' ? parseInt(input) : input
	const formatted = num.toString().padStart(4, '0')
	return formatted
}
