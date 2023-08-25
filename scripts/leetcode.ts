const path = require('path')
const fs = require('fs')

const leetCodeRequestBody = {
	query:
		'\n    query questionContent($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    content\n    mysqlSchemas\n    dataSchemas\n  }\n}\n    ',
	variables: {
		titleSlug: 'binary-search',
	},
	operationName: 'questionContent',
}

process.argv.forEach(async function (val, index, arr) {
	if (arr[2] === undefined || arr[3] === undefined) {
		console.log('Please provide a leetcode link and a category folder name')
		return
	}

	if (index < 2) {
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
		const apiUrl = 'https://leetcode.com/graphql'

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(leetCodeRequestBody),
		})

		const data = await response.json()
		const contentFromApi = data.data.question.content

		if (!contentFromApi) {
			console.log(
				'Failed to fetch problem from leetcode. Please check the leetcode link',
			)
			return
		}

		//transform the contentFromApi to mdx format:
		const description = contentFromApi
			// .replace(/<code>/g, '`')
			// .replace(/<\/code>/g, '`')
			.replace(/<strong>/g, '')
			.replace(/<\/strong>/g, '')
			.replace(/<strong class="example">/g, '')
			.replace(/<pre>/g, '```mdx')
			.replace(/<\/pre>/g, '```')
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

		const solutionTemplate =
			'### Javascript\n ```javascript\n  javascript solution here\n ```\n### Python\n ```python\n python solutuion here\n ```\n### C++\n ```cpp\n c++ solution here\n ```\n### Java\n ```java\n java solution here\n ```\n'

		const problemTemplate = `---
title: ${problemName}
category: ${folderName}
difficulty: Easy
---

<Callout>

[Leetcode Link](${leetcodeLink})

</Callout>

## Description
${description}

## Solution

${solutionTemplate}

`

		fs.writeFileSync(problemPath, problemTemplate)

		console.log(`Problem ${folderName}/${problemName} created`)
	} catch (error) {
		console.log(error)
	}
})
// Run the script by running `yarn ts-node scripts/leetcode.ts [leetcode link] [category folder name]`
