'use client'
import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'
import { toast } from './ui/use-toast'

export function CodeBlock(props: { text: string; language: string }) {
	return (
		<div className="mb-6 mt-4">
			<CopyBlock
				text={props.text}
				language={props.language}
				showLineNumbers={false}
				theme={{
					...dracula,
					mode: 'dark',
				}}
				wrapLines={false}
				codeBlock
				onCopy={() =>
					toast({
						description: 'Copied to clipboard!',
					})
				}
				copied={true}
				wrapLongLines={false}
			/>
		</div>
	)
}
