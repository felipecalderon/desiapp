/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.d3si.cl',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['pdf-parse'],
    },
    webpack: (config) => {
        config.externals = [...config.externals, 'canvas', 'jsdom']
        return config
    },
}

module.exports = nextConfig
