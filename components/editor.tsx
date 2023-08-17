'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Post } from '@prisma/client'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import * as z from 'zod'

import '@/styles/editor.css'
import { cn } from '@/lib/utils'
import { postPatchSchema } from '@/lib/validations/post'
import { buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PROBLEM_PROGRESS } from '@/constants/problem'
import { User } from 'next-auth'

interface EditorProps {
	post: Pick<
		Post,
		| 'id'
		| 'title'
		| 'content'
		| 'star'
		| 'mdId'
		| 'progress'
		| 'published'
		| 'authorId'
	>
	user:
		| (User & {
				id: string
				role: unknown
		  })
		| undefined
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post, user }: EditorProps) {
	const { register, handleSubmit } = useForm<FormData>({
		resolver: zodResolver(postPatchSchema),
	})
	const ref = React.useRef<EditorJS>()
	const router = useRouter()
	const [isSaving, setIsSaving] = React.useState<boolean>(false)
	const [isMounted, setIsMounted] = React.useState<boolean>(false)
	const [tags, setTags] = React.useState({
		progress: post?.progress || '',
		mdId: post?.mdId || 'arrays-and-hashing-contains-duplicate',
		star: post?.star || false,
	})

	const initializeEditor = React.useCallback(async () => {
		const EditorJS = (await import('@editorjs/editorjs')).default
		const Header = (await import('@editorjs/header')).default
		const Embed = (await import('@editorjs/embed')).default
		const Table = (await import('@editorjs/table')).default
		const List = (await import('@editorjs/list')).default
		const Code = (await import('@editorjs/code')).default
		const LinkTool = (await import('@editorjs/link')).default
		const InlineCode = (await import('@editorjs/inline-code')).default

		const body = postPatchSchema.parse(post)

		if (!ref.current) {
			const editor = new EditorJS({
				holder: 'editor',
				onReady() {
					ref.current = editor
				},
				placeholder: 'Type here to write Your note...',
				inlineToolbar: true,
				data: body.content,
				tools: {
					header: Header,
					linkTool: LinkTool,
					list: List,
					code: Code,
					inlineCode: InlineCode,
					table: Table,
					embed: Embed,
				},
				//view mode
				// readOnly: true,
			})
		}
	}, [post])

	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsMounted(true)
		}
	}, [])

	React.useEffect(() => {
		if (isMounted) {
			initializeEditor()

			return () => {
				ref.current?.destroy()
				ref.current = undefined
			}
		}
	}, [isMounted, initializeEditor])

	async function onSubmit(data: FormData) {
		if (!tags.mdId) {
			toast({
				title: 'Something went wrong.',
				description: 'markdown Id is required. Please try again.',
				variant: 'destructive',
			})
			return
		}

		data.mdId = tags.mdId
		data.progress = tags.progress
		data.star = tags.star
		data.authorId = post.authorId
		data.title = post.title

		setIsSaving(true)

		const blocks = await ref.current?.save()
		let response
		if (!post.id) {
			response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: data.title,
					mdId: data.mdId,
					progress: data.progress,
					star: data.star,
					content: blocks,
					authorId: data.authorId,
				}),
			})
		} else {
			response = await fetch(`/api/posts/${post.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: data.title,
					mdId: data.mdId,
					progress: data.progress,
					star: data.star,
					content: blocks,
				}),
			})
		}

		setIsSaving(false)

		if (!response?.ok) {
			return toast({
				title: 'Something went wrong.',
				description: 'Your note was not saved. Please try again.',
				variant: 'destructive',
			})
		}

		router.refresh()

		return toast({
			description: 'Your note has been saved.',
		})
	}

	if (!isMounted) {
		return null
	}
	return (
		<div className="overflow-auto pt-[4rem]" id="note">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid  w-full gap-10">
					<div className="prose prose-stone mx-auto max-w-[800px] dark:prose-invert">
						<TextareaAutosize
							autoFocus
							id="title"
							defaultValue={post.title}
							placeholder="Post title"
							className="w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none"
							{...register('title')}
							disabled={true}
						/>
						<div className="flex items-center">
							<Select
								{...register('progress')}
								onValueChange={(value) => setTags({ ...tags, progress: value })}
								defaultValue={post.progress || undefined}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select progress" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(PROBLEM_PROGRESS).map((progress) => (
										<SelectItem
											key={PROBLEM_PROGRESS[progress]}
											value={PROBLEM_PROGRESS[progress]}
										>
											{progress}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<button
								type="button"
								className={cn(
									buttonVariants({
										variant: 'outline',
									}),
									'flex items-center ml-2',
								)}
								onClick={() => setTags({ ...tags, star: !tags.star })}
							>
								<Icons.star
									className={`${
										tags.star && ' fill-yellow-500 text-yellow-500'
									} inline h-5 w-5`}
								/>
							</button>
						</div>
						<div id="editor" className="min-h-[300px]" />
						<div className="flex w-full items-center">
							<button
								disabled={!user}
								type="submit"
								className={cn(buttonVariants({ size: 'lg' }))}
							>
								{isSaving && (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								)}
								<span>{user ? 'Save Note' : 'Sign in to save note'}</span>
							</button>
						</div>
						<p className="text-sm text-gray-500">
							Use{' '}
							<kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
								Tab
							</kbd>{' '}
							to open the command menu.
						</p>
					</div>
				</div>
			</form>
		</div>
	)
}
