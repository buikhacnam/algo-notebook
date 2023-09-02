const { withContentlayer } = require('next-contentlayer')
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: ['assets.leetcode.com', 's3-lc-upload.s3.amazonaws.com'],
	},
}

module.exports = withContentlayer(nextConfig)
