/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'tpmjohhfasdshvfvicxc.supabase.co', // add any other domains you use
          },
        ],
    }
}

module.exports = nextConfig
