const { withContentlayer } = require('next-contentlayer')
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: ['assets.leetcode.com'],
	},
}

module.exports = withContentlayer(nextConfig)
