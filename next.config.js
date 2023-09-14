/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.d3si.cl'
            }
        ]
    }
}

module.exports = nextConfig
