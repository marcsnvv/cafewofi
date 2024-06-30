/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh5.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "scontent-bcn1-1.cdninstagram.com"
            },
            {
                protocol: "https",
                hostname: "ifupqjhlohfpuohoklbf.supabase.co"
            },

        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "3mb"
        }
    },
    async rewrites() {
        return [
            {
                source: '/ui',
                destination: '/',
            },
        ]
    },
}

module.exports = nextConfig
