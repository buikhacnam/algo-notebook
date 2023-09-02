const p = require('path')
const f = require('fs')
const listPath = p.join(__dirname, '.', 'problems.json')
const problems = JSON.parse(f.readFileSync(listPath, 'utf-8'))
// loop through the problems and create the mdx files by calling the './leetcode.ts' script

// const problems = {
// 	'Advanced Graphs': ['https://leetcode.com/problems/alien-dictionary/'],
// 	'1D Dynamic Programming': [
// 		'https://leetcode.com/problems/climbing-stairs/',
// 		'https://leetcode.com/problems/house-robber/',
// 		'https://leetcode.com/problems/house-robber-ii/',
// 		'https://leetcode.com/problems/longest-palindromic-substring/',
// 	],
// }

for (const category in problems) {
	for (const problem of problems[category]) {
		console.log(`Creating problem ${problem}...`)
		const categoryDash = category.toLowerCase().replace(/\s/g, '-')
		const { spawnSync } = require('child_process')
		const { stdout, stderr } = spawnSync('ts-node', [
			'scripts/leetcode.ts',
			problem,
			categoryDash,
		])

		console.log(`Created problem ${problem}`)
	}
}
