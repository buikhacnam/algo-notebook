const path = require('path')
const fs = require('fs')
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

process.argv.forEach(async function (val, index, arr) {
	if (index < 3) {
		return
	}
	if (arr[2] === undefined || arr[3] === undefined) {
		console.log('Please provide leetcode link and category folder name')
		return
	}

	try {
		console.log('Creating problem...')
		const folderName = arr[3]
		let leetcodeLink = arr[2] // https://leetcode.com/problems/binary-search/
		// remove the last slash if it exists
		if (leetcodeLink[leetcodeLink.length - 1] === '/') {
			leetcodeLink = leetcodeLink.slice(0, leetcodeLink.length - 1)
		}
		// get the problem name
		const problemName = leetcodeLink.split('/').pop()

		if (problemName === undefined) {
			console.log('Please provide a valid leetcode link')
			return
		}

		// create the folder if it doesn't exist
		const problemGeneratedPath = path.join(
			__dirname,
			'..',
			'content',
			'problems',
			folderName,
		)
		if (!fs.existsSync(problemGeneratedPath)) {
			fs.mkdirSync(problemGeneratedPath)
		}

		const problemPath = path.join(
			__dirname,
			'..',
			'content',
			'problems',
			folderName,
			`${problemName}.mdx`,
		)

		if (fs.existsSync(problemPath)) {
			console.log(`Problem ${problemName} already exists`)
			return
		}

		leetCodeRequestBody.variables.titleSlug = problemName

		const response = await fetch(leetCodeGraphqlUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(leetCodeRequestBody),
		})

		const data = await response.json()
		let contentFromApi = data.data.question.content
		const questionFrontendId = data.data.question.questionFrontendId
		const title = data.data.question.title
		const difficulty = data.data.question.difficulty
		const categoryName = folderName
			.split('-')
			.map((word: string) => word[0].toUpperCase() + word.slice(1))
			.join(' ')

		if (!contentFromApi) {
			console.log(
				'Failed to fetch problem from leetcode. Please check the leetcode link',
			)
			contentFromApi = 'This problem is on Premium plan or is not available'
		}
		const javascriptUrl = `${neetCodeRepo}javascript/${neetCodePadNumber(
			questionFrontendId,
		)}-${problemName}.js`
		const pythonUrl = `${neetCodeRepo}python/${neetCodePadNumber(
			questionFrontendId,
		)}-${problemName}.py`
		const cppUrl = `${neetCodeRepo}cpp/${neetCodePadNumber(
			questionFrontendId,
		)}-${problemName}.cpp`
		const javaUrl = `${neetCodeRepo}java/${neetCodePadNumber(
			questionFrontendId,
		)}-${problemName}.java`

		let javascriptSolution = 'javascript solution here'
		let pythonSolution = 'python solution here'
		let cppSolution = 'c++ solution here'
		let javaSolution = 'java solution here'

		// fetch the solutions from neetcode repo
		try {
			const javascriptResponse = await fetch(javascriptUrl)
			javascriptSolution = await javascriptResponse.text()
		} catch (error) {
			console.log(`Failed to fetch javascript solution from ${javascriptUrl}`)
		}

		try {
			const pythonResponse = await fetch(pythonUrl)
			pythonSolution = await pythonResponse.text()
		} catch (error) {
			console.log(`Failed to fetch python solution from ${pythonUrl}`)
		}

		try {
			const cppResponse = await fetch(cppUrl)
			cppSolution = await cppResponse.text()
		} catch (error) {
			console.log(`Failed to fetch cpp solution from ${cppUrl}`)
		}

		try {
			const javaResponse = await fetch(javaUrl)
			javaSolution = await javaResponse.text()
		} catch (error) {
			console.log(`Failed to fetch java solution from ${javaUrl}`)
		}

		//transform the contentFromApi to mdx format:
		const description = contentFromApi
			// .replace(/<code>/g, '`')
			// .replace(/<\/code>/g, '`')
			.replace(/<img /g, '<Image ')
			.replace(/<strong>/g, '')
			.replace(/<\/strong>/g, '')
			.replace(/<strong class="example">/g, '')
			.replace(/<pre>/g, '<br /><pre className="overflow-x-auto">')
			// .replace(/<\/pre>/g, '```')
			.replace(/<p>/g, '')
			.replace(/<\/p>/g, '')
			.replace(/<ul>/g, '')
			.replace(/<\/ul>/g, '')
			.replace(/<li>/g, '- ')
			.replace(/<\/li>/g, '')
			.replace(/<em>/g, '*')
			.replace(/<\/em>/g, '*')
			.replace(/<br>/g, '\n')
			.replace(/&nbsp;/g, ' ')
			.replace(/style="/g, '')
			.replace(/width: /g, 'width={')
			.replace(/px;"/g, '}')
			.replace(/px;/g, '}')
			.replace(/height: /g, 'height={')

		const solutionTemplate = `### Javascript\n\`\`\`javascript\n${javascriptSolution}\n\`\`\`\n### Python\n\`\`\`python\n${pythonSolution}\n\`\`\`\n### C++\n\`\`\`cpp\n${cppSolution}\n\`\`\`\n### Java\n\`\`\`java\n${javaSolution}\n\`\`\`\n`

		const problemTemplate = `---
title: ${title}
category: ${categoryName}
difficulty: ${difficulty}
---

<Callout>

[Leetcode Link](https://leetcode.com/problems/${problemName})

</Callout>

## Description
${description}

## Solution

${solutionTemplate}

`

		fs.writeFileSync(problemPath, problemTemplate)

		// Read the content from /list.json file and add the problem to the list
		const listPath = path.join(__dirname, '.', 'list.json')
		const list = JSON.parse(fs.readFileSync(listPath, 'utf-8'))
		const category = list.problems.find(
			(item: any) => item.title === categoryName,
		)
		// check if the problem already exists
		if (category.items.find((item: any) => item.title === title)) {
			console.log(`Problem ${folderName}/${problemName} already exists`)
		} else {
			category.items.push({
				title: title,
				href: `/problems/${folderName}/${problemName}`,
				mdId: `${folderName}/${problemName}`,
				level: difficulty,
			})

			fs.writeFileSync(listPath, JSON.stringify(list, null, 2))
			fs.writeFileSync(
				path.join(__dirname, '..', 'config', 'problems.ts'),
				`
import { ProblemsConfig } from 'types'
export const problemsConfig: ProblemsConfig  = ${JSON.stringify(
					list,
					null,
					2,
				)}`,
			)
		}
		console.log(`Problem ${folderName}/${problemName} created`)
	} catch (error) {
		console.log(error)
	}
})

function neetCodePadNumber(input: number | string): string {
	const num = typeof input === 'string' ? parseInt(input) : input
	const formatted = num.toString().padStart(4, '0')
	return formatted
}

// Run the script by running `yarn ts-node scripts/leetcode.ts [leetcode link] [category folder name]`
